const mongoose = require('mongoose');
const validator = require("validator");

const postSchema = new mongoose.Schema({
    brand: {
        type: String,
        required: true,
        trim: true
    },
    model: {
        type: String,
        required: true,
        trim: true
    },
    variant: {
        type: String,
        trim: true
    },

    price: {
        amount: {
            type: Number,
            required: true,
            min: 1
        },
        currency: {
            type: String,
            default: 'INR'
        }
    },
    kilometersDriven: {
        type: Number,
        min: 0
    },
    manufacturingYear: {
        type: Number,
        min: 1900,
        max: new Date().getFullYear()
    },
    registrationYear: {
        type: Number,
        required: true,
        min: 1900,
        max: new Date().getFullYear()
    },
    owners: {
        type: String,
        trim: true,
        minLength: 1,
        maxLength: 2
    },

    fuelType: {
        type: String,
        enum: ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid', 'Other']
    },
    transmission: {
        type: String,
        enum: ['Manual', 'Automatic', 'Other']
    },

    color: {
        type: String,
        trim: true
    },

    seller: {
        sellerName: { type: String, trim: true },
        contact: { type: String },
        location: {
            city: { type: String, trim: true },
            area: { type: String, trim: true },
            pincode: { type: String, trim: true }
        }
    },

    insurance: {
        type: Boolean,
        default: true
    },

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    images: [String],

}, { timestamps: true });


const Post = mongoose.model('Post', postSchema);

module.exports = { Post };
