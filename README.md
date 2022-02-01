# texting-microservice

-   Microservice for CS361 - Software Engineering I
-   This microservice will handle sending SMS messages for you
-   Note: This service will only send 100 SMS messages per day combined across all users of the service.

## How to use

---

### Sending texts

Send a POST request to http://placeholderlink.com/send-texts.

The service will expect a JSON array of message objects. Each message object should have the following attributes:

| Attribute   | Datatype     | Example           |
| ----------- | ------------ | ----------------- |
| phoneNumber | Content Cell | `"+12025550183"`  |
| msg         | Content Cell | `"Test message."` |

1. phoneNumber - This is the phone number you want to send an SMS message to. This phone number must be a string in the full 10-digit format with a plus sign in front.

    In the above example of `"+12025550183"`:

    - The plus sign and the first digit, `+1`, refer to the country code (the country code `+1` refers to the USA).

    - The next three digits `202` are the area code.

    - The final 7 digits `5550183` are the phone number.

2. msg - This is the text that will comprise the SMS message.

    - The text is limited to 320 characters. Any characters beyond the 320 character limit will be ignored.

### Response

After a POST request is received a response will be sent in JSON format and will be comprised of **an array of objects**. Each object in the array will contain details about each SMS that was attempted.

-   If an SMS was **successful**, the object will have the following attributes:

    -   to
    -   body
    -   dateCreated
    -   updated

-   If an SMS was **unsuccessful**, the object will have the following attributes:

    -   errorMessage
    -   errorCode
    -   status
    -   to
    -   body
    -   moreInfo

## Deployment

---

http://placeholderlink.com
