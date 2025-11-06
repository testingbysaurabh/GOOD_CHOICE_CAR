const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const { User } = require('../models/User');
const { isLoggedIn } = require('../middleware/isLoggedIn');
const { OTP } = require('../models/OTP');
const { VerifiedMail } = require('../models/verifiedMail');

const router = express.Router();

// Signup route
router.post('/admin/signup', async (req, res) => {
    try {
        const { firstName, lastName, phone, mail, password } = req.body;
        if (!firstName || !lastName || !phone || !mail || !password)
            throw new Error('Enter all fields');

        const existingUser = await User.findOne({
            $or: [{ mail: mail.toLowerCase() }, { phone }]
        });
        if (existingUser) throw new Error('User already exists');

        if (!validator.isStrongPassword(password))
            throw new Error('Please enter a strong password (upper, lower, number, symbol)');

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            firstName,
            lastName,
            phone,
            mail: mail.toLowerCase(),
            password: hashedPassword
        });

        res.status(201).json({ msg: 'User created successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});



// Login route
router.post('/admin/login', async (req, res) => {
    try {
        const { mail, phone, password } = req.body;
        if ((!mail && !phone) || !password)
            throw new Error('Enter all fields');

        const foundUser = await User.findOne({
            $or: [{ mail: mail ? mail.toLowerCase() : null }, { phone }]
        }).populate('posts');
        if (!foundUser) throw new Error('User not found');

        const isPasswordValid = await bcrypt.compare(password, foundUser.password);
        if (!isPasswordValid) throw new Error('Invalid password');

        const token = jwt.sign({ _id: foundUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24,
            sameSite: 'lax'
            // secure: true // Uncomment for HTTPS jab karunga yaad se
        });

        res.status(200).json({
            msg: 'Login successful',
            data: {
                firstName: foundUser.firstName,
                lastName: foundUser.lastName,
                phone: foundUser.phone,
                mail: foundUser.mail,
                posts: foundUser.posts
            }
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});



// Logout route //
router.post('/admin/logout', isLoggedIn, (req, res) => {
    res.clearCookie('token').json({ msg: 'User logged out' });
});




// Change password route //
router.patch('/admin/change-password', isLoggedIn, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword)
            throw new Error('Please provide both current and new password');

        const isMatch = await bcrypt.compare(currentPassword, req.user.password);
        if (!isMatch) throw new Error('Current password is incorrect');

        if (!validator.isStrongPassword(newPassword))
            throw new Error('Please enter a strong password (upper, lower, number, symbol)');

        const newHashedPassword = await bcrypt.hash(newPassword, 10);
        req.user.password = newHashedPassword;
        await req.user.save();

        res.status(200).json({ msg: 'Password changed successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});




//////////

router.patch("/admin/forgetpassword", async (req, res) => {
    try {
        const { mail, otp, newPassword } = req.body;

        // check fields
        if (!mail) throw new Error("Please provide mail ");
        if (!otp) throw new Error("Please provide otp ");
        if (!newPassword) throw new Error("Please provide password ");


        // verified check
        const verified = await VerifiedMail.findOne({ mail: mail.toLowerCase() })
        if (!verified) {
            return res.status(400).json({ error: "Not a verified User " });
        }

        // find OTP in DB
        const foundOtp = await OTP.findOne({ mail, otp });
        if (!foundOtp) {
            return res.status(400).json({ error: "Invalid OTP or mail" });
        }


        // check expiry 
        const now = Date.now();
        if (now - foundOtp.createdAt > 2 * 60 * 1000) {
            return res.status(400).json({ error: "OTP expired, please request a new one" });
        }




        if (!validator.isStrongPassword(newPassword)) {
            throw new Error('Please enter a strong password (upper, lower, number, symbol)');
        }
        const newHashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findOneAndUpdate({ mail }, { password: newHashedPassword });

        await OTP.deleteMany({ mail });

        return res.status(201).json({ msg: "Password reset successfully ✅" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});





//get user //
router.get("/admin/get-user-data", isLoggedIn, async (req, res) => {
    try {
        const { firstName, lastName, phone, mail, posts } = req.user;
        const data = { firstName, lastName, phone, mail, posts };
        res.status(200).json({ msg: "done", data: data });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});



module.exports = {
    AuthRoutes: router
};
