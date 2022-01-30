require("dotenv").config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

// Array of objects with a phone number and a message
const msgObjs = [
    {
        phoneNumber: "+15555555555",
        msg: "Sending you a test text message!",
    },
    {
        phoneNumber: "+15555555555",
        msg: "Sending out another test text message!",
    },
];

// Send out a text message for each message object in msgObjs
msgObjs.forEach((msgObj) => {
    client.messages
        .create({
            body: msgObj.msg,
            from: process.env.TWILIO_NUMBER,
            to: msgObj.phoneNumber,
        })
        .then((message) => console.log(message))
        .catch((err) => console.log(err));
});
