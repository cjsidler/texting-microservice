const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");

exports.signup = (req, res) => {
    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        role: "normal",
        password: bcrypt.hashSync(req.body.password, 12),
        textsRemaining: 0,
    });

    newUser.save((error, user) => {
        if (error) {
            console.log(error);
            res.status(500).send({ message: error });
            return;
        } else {
            res.status(200).send({
                message: "You have successfully registered a new user.",
            });
        }
    });
};

exports.login = (req, res) => {
    User.findOne({
        email: req.body.email,
    }).exec((error, user) => {
        if (error) {
            console.log(error);
            res.status(500).send({ message: error });
            return;
        }
        if (!user) {
            return res.status(404).send({
                message: "Username and/or password was incorrect.",
            });
        }

        // Use bcrypt to compare the given password to the hashed password in the database.
        const validatedPassword = bcrypt.compareSync(
            req.body.password,
            user.password
        );

        // If the password was not valid, send an error message.
        if (!validatedPassword) {
            return res.status(401).send({
                accessToken: null,
                message: "Username and/or password was incorrect.",
            });
        }

        // Otherwise, generate a 12 hour JWT containing the MongoDB ObjectId of the given user.
        const JWTtoken = jwt.sign(
            {
                id: user.id,
            },
            process.env.API_SECRET,
            {
                expiresIn: 43200,
            }
        );

        // Provide the request with details about the user and the JWT.
        res.status(200).send({
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                textsRemaining: user.textsRemaining,
            },
            message: "Your log-in attempt was successful.",
            accessToken: JWTtoken,
        });
    });
};
