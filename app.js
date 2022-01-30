require("dotenv").config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const originNumber = process.env.TWILIO_ORIGIN_NUMBER;

const testRecipientNumber = process.env.TWILIO_TEST_RECIPIENT_NUMBER;

const client = require("twilio")(accountSid, authToken);

// Array of objects with a phone number and a message
const msgObjs = [
    {
        phoneNumber: testRecipientNumber,
        msg: "Sending you a test text message!",
    },
];

// Send out a text message for each message object in msgObjs
msgObjs.forEach((msgObj) => {
    client.messages
        .create({
            body: msgObj.msg,
            from: originNumber,
            to: msgObj.phoneNumber,
        })
        .then((message) => console.log(message))
        .catch((err) => console.log(err));
});
