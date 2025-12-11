const mongoose = require("mongoose");
const validator = require("validator");

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        minlength: 2,
        maxlength: 15,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        minlength: 2,
        maxlength: 15,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        unique: true,
        required: true,
        validate: {
            validator: function (val) {
                return validator.isMobilePhone(val, 'en-IN'); // only Indian numbers
            },
            message: "Enter a valid Indian phone number"
        }
    },
    mail: {
        lowercase: true,
        type: String,
        minlength: 6,
        required: true,
        trim: true,
        unique: true,
        immutable: true,
        validate: {
            validator: function (val) {
                return validator.isEmail(val);
            },
            message: "Please enter a valid email"
        }
    },
    password: {
        required: true,
        type: String,
        minlength: 8,
        trim: true
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }]
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

module.exports = { User };



