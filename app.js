if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const port = process.env.PORT;
const mongoose = require("mongoose");
const verifyJWTToken = require("./middleware/verifyJWT");
const { signup, login } = require("./controller/auth.js");
const User = require("./models/user");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const originNumber = process.env.TWILIO_ORIGIN_NUMBER;

const client = require("twilio")(accountSid, authToken);

// MongoDB connection
try {
    mongoose.connect("mongodb://localhost:27017/usersdb", {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    });
    console.log("MongoDB connection established.");
} catch (err) {
    console.log(err);
}

process.on("unhandledRejection", (err) => {
    console.log("unhandledRejection", err.message);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function sendText(msgObj) {
    /**
     * Sends a text message using the msgObj passed via Twilio.
     * Expects a phoneNumber string of a phone number in 10-digit format.
     * Expects a msg string to send in the body of the text message (320 chars or less in length).
     **/

    const { phoneNumber, msg } = msgObj;

    return client.messages
        .create({
            body: msg.slice(0, 321),
            from: originNumber,
            to: phoneNumber,
        })
        .then((message) => {
            const { body, to, dateCreated, status } = message;
            const msgRes = {
                body,
                to,
                dateCreated,
                status,
            };
            return msgRes;
        })
        .catch((err) => {
            const { status, code, moreInfo } = err;
            const errObj = {
                errorMessage: err.message,
                errorCode: code,
                status,
                to: phoneNumber,
                body: msg,
                moreInfo,
            };
            return errObj;
        });
}

app.post("/sign-up", signup, function (req, res) {});

app.post("/log-in", login, function (req, res) {});

app.post("/send-texts", verifyJWTToken, async function (req, res) {
    if (!req.user) {
        res.status(403).send({
            error: "JWT token is not valid. Try again.",
        });
    }
    if (req.user.role == "admin") {
        const txtArray = req.body;
        const resArray = [];

        for (const msgObj of txtArray) {
            const { phoneNumber, msg } = msgObj;
            const user = await User.findOne({ _id: req.user._id });

            if (user.textsRemaining > 0) {
                const txtRes = await sendText(msgObj);
                resArray.push(txtRes);
                if ("dateCreated" in txtRes) {
                    user.textsRemaining -= 1;
                }
            } else {
                resArray.push({
                    errorMessage:
                        "Message undelivered: Your allotment of text messages has run out.",
                    to: phoneNumber,
                    body: msg,
                });
            }

            user.save();
        }

        res.json(resArray);
    } else {
        res.status(403).send({
            error: "You are not authorized to access this feature of the microservice.",
        });
    }
});

app.listen(port, () => {
    console.log(`Texting Microservice is listening on port ${port}.`);
});
