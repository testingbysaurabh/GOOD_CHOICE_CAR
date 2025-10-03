const mongoose = require("mongoose")
const validator = require("validator");


const verifiedMailSchema = new mongoose.Schema({
    mail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate: function (val) {
            const isEmail = validator.isEmail(val)
            if (!isEmail) {
                throw new Error("Please enter a valid email");
            }
        }

    }
}, { timestamps: true })

const VerifiedMail = mongoose.model('VerifiedMail', verifiedMailSchema)
module.exports = {
    VerifiedMail
}