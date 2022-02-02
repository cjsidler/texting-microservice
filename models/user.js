const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        validate: {
            validator: function (v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
        },
    },
    role: {
        type: String,
        enum: ["normal", "admin"],
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    textsRemaining: {
        type: Number,
        minimum: 0,
    },
});

module.exports = mongoose.model("User", userSchema);
