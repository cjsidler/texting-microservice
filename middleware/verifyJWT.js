const jwt = require("jsonwebtoken");
const User = require("../models/user");

const verifyJWTToken = (req, res, next) => {
    if (req.headers && req.headers.authorization) {
        // If the request has an authorization header, attempt to verify the JWT token.
        jwt.verify(
            req.headers.authorization,
            process.env.API_SECRET,
            function (error, decoded) {
                // If JWT is invalid, set user to undefined.
                if (error) {
                    req.user = undefined;
                }

                console.log({ decoded });

                // If JWT is valid, use the MongoDB ObjectId in the JWT to lookup the user in the db.
                User.findOne({
                    _id: decoded.id,
                }).exec((error, user) => {
                    // If the ObjectId is not found in the db, respond with the error, otherwise set user to found document.
                    if (error) {
                        res.status(500).send({
                            message: error,
                        });
                    } else {
                        req.user = user;
                        next();
                    }
                });
            }
        );
    } else {
        // If the request did not have an authorization header, set user to undefined.
        req.user = undefined;
        next();
    }
};

module.exports = verifyJWTToken;
