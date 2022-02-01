/**
 * @todo Authorize users
 * @todo Limit texts to 100 maximum per day
 **/

require("dotenv").config();

const express = require("express");
const app = express();
const port = 3000;

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const originNumber = process.env.TWILIO_ORIGIN_NUMBER;

const client = require("twilio")(accountSid, authToken);

app.use(express.json());

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

app.post("/send-texts", async (req, res) => {
    const txtArray = req.body;
    const resArray = [];

    for (const msgObj of txtArray) {
        const txtRes = await sendText(msgObj);
        resArray.push(txtRes);
    }

    res.json(resArray);
});

app.listen(port, () => {
    console.log(`Texting Microservice listening on port ${port}`);
});
