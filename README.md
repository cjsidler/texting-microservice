# texting-microservice

-   Microservice for CS361 - Software Engineering I
-   This microservice will handle sending SMS messages for you

## How to use

### Sending texts

Send a x-www-form-urlencoded POST request to https://texting-microservice.herokuapp.com/log-in with the properties "email" and "password" with values that match a user account in the database. If the microservice finds a match, a token that is good for 12 hours will be returned to you in a JSON object. Also in the JSON object will be an indicator of the remaining number of text messages you can send. Here is an example of the format of the response:

```json
{
    "user": {
        "id": "507f1f77bcf86cd799439011",
        "email": "useremail@website.com",
        "name": "John Doe",
        "textsRemaining": 500
    },
    "message": "Login successfull",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
}
```

Then, send a POST request to https://texting-microservice.herokuapp.com/send-texts with an "authorization" header that has a value of the token you received in the previous step. The service will also expect a JSON array of message objects in the body of the POST request. Each message object should have the following attributes:

1. phoneNumber - This is the phone number you want to send an SMS message to. This phone number must be a string in the full 10-digit format with a plus sign in front.

    For example, `"+12025550183"`:

    - The plus sign and the first digit, `+1`, refer to the country code (the country code `+1` refers to the USA).

    - The next three digits `202` are the area code.

    - The final 7 digits `5550183` are the phone number.

2. msg - This is the text that will comprise the SMS message.

    - The text is limited to 320 characters. Any characters beyond the 320 character limit will be ignored.

Sample POST request body for one text message:

```json
[
    {
        "phoneNumber": "+15005550000",
        "msg": "A sample text message with a fake phone number!"
    }
]
```

Sample POST request body for multiple text messages:

```json
[
    {
        "phoneNumber": "+15005550000",
        "msg": "A sample text message with a fake phone number!"
    },
    {
        "phoneNumber": "+15005550001",
        "msg": "Another sample text message!"
    },
    {
        "phoneNumber": "+15005550006",
        "msg": "A third sample text message!"
    }
]
```

### Response

After a POST request is received a response will be sent in JSON format and will be comprised of **an array of objects**. Each object in the array will contain details about each SMS that was attempted.

-   If an SMS was **successful**, the object will have the following attributes:

    -   to (the phone number to which the text message was attempted)
    -   body (the message of the text)
    -   dateCreated
    -   status

-   If an SMS was **unsuccessful**, the object will have the following attributes:

    -   errorMessage
    -   to (the phone number to which the text message was attempted)
    -   body (the message of the text)

    Possible extra attributes:

    -   errorCode
    -   status
    -   moreInfo

## Deployment

https://texting-microservice.herokuapp.com/

## Sources Cited

Followed tutorial for implementing JWT authorization in Express.js by K. Rathour from topcoder.com at https://bit.ly/3B1kq2U.
