const express = require('express');
const router = express.Router();
const { OTP } = require('../models/OTP');
const { VerifiedMail } = require("../models/verifiedMail");
const nodemailer = require("nodemailer");
const { otpLimiter } = require("../middleware/OtpLimiter");
const { User } = require('../models/User');


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_ID,
    pass: process.env.APP_PASSWORD
  }
});




function GenerateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Route: Send OTP
router.post("/otp/send-otp", otpLimiter, async (req, res) => {
  try {
    const { mail } = req.body;

    if (!mail) {
      return res.status(400).json({ error: "Mail is required" });
    }


    // // Check if already verified
    // const alreadyVerified = await VerifiedMail.findOne({ mail: mail.toLowerCase() });
    // if (alreadyVerified) {
    //   return res.status(400).json({ error: "Mail is already verified" });
    // }


    // Generate OTP & save in DB
    const createdOtp = GenerateOtp();
    await OTP.create({ mail: mail.toLowerCase(), otp: createdOtp, createdAt: Date.now() });

    // Send OTP mail
    await transporter.sendMail({
      from: process.env.MAIL_ID,
      // to: mail,
      to: "testingbysaurabh@gmail.com",
      subject: "Good Choice Car - Your OTP Code",
      html: `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="UTF-8" />
                <title>OTP Verification</title>
              </head>
              <body style="margin:0; padding:0; font-family: Arial, sans-serif; background:#f4f4f4;">
                <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
                  <tr>
                    <td style="background:#1e3a8a; padding:20px; text-align:center; color:#fff;">
                      <h1 style="margin:0; font-size:24px;">🚗 GOOD CHOICE CAR</h1>
                      <p style="margin:0; font-size:14px;">Drive Your Dream With Us</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:30px; text-align:center;">
                      <h2 style="color:#333; margin-bottom:10px;">Your OTP Code</h2>
                      <p style="color:#555; font-size:16px;">Use the OTP below to verify your email</p>
                      <div style="margin:20px 0;">
                        <span style="display:inline-block; padding:15px 30px; font-size:32px; font-weight:bold; color:#1e3a8a; border:2px dashed #1e3a8a; border-radius:8px; letter-spacing:5px;">
                          ${createdOtp}
                        </span>
                      </div>
                      <p style="color:#777; font-size:14px;">⚠️ This OTP will expire in <b>2 minutes</b>.</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="background:#f9fafb; padding:15px; text-align:center; color:#555; font-size:12px;">
                      <p style="margin:0;"> © Good Choice Car. All Rights Reserved.</p>
                    </td>
                  </tr>
                </table>
              </body>
              </html>
            `
    });


    return res.status(200).json({ message: "OTP sent successfully" });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});



/////of forgetPass
router.post("/admin/sendOtp", otpLimiter, async (req, res) => {
  try {
    const { mail } = req.body;

    if (!mail) {
      return res.status(400).json({ error: "Mail is required" });
    }


    // // Check if already verified
    const alreadyVerified = await VerifiedMail.findOne({ mail: mail.toLowerCase() });
    if (!alreadyVerified) {
      return res.status(400).json({ error: "not a existing user/mail" });
    }


    // Generate OTP & save in DB
    const createdOtp = GenerateOtp();
    await OTP.create({ mail: mail.toLowerCase(), otp: createdOtp, createdAt: Date.now() });

    // Send OTP mail
    await transporter.sendMail({
      from: process.env.MAIL_ID,
      // to: mail,
      to: "testingbysaurabh@gmail.com",
      subject: "Good Choice Car - Your OTP Code",
      html: `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="UTF-8" />
                <title>OTP Verification</title>
              </head>
              <body style="margin:0; padding:0; font-family: Arial, sans-serif; background:#f4f4f4;">
                <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
                  <tr>
                    <td style="background:#1e3a8a; padding:20px; text-align:center; color:#fff;">
                      <h1 style="margin:0; font-size:24px;">🚗 GOOD CHOICE CAR</h1>
                      <p style="margin:0; font-size:14px;">Drive Your Dream With Us</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:30px; text-align:center;">
                      <h2 style="color:#333; margin-bottom:10px;">Your OTP Code</h2>
                      <p style="color:#555; font-size:16px;">Use the OTP below to verify your email</p>
                      <div style="margin:20px 0;">
                        <span style="display:inline-block; padding:15px 30px; font-size:32px; font-weight:bold; color:#1e3a8a; border:2px dashed #1e3a8a; border-radius:8px; letter-spacing:5px;">
                          ${createdOtp}
                        </span>
                      </div>
                      <p style="color:#777; font-size:14px;">⚠️ This OTP will expire in <b>2 minutes</b>.</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="background:#f9fafb; padding:15px; text-align:center; color:#555; font-size:12px;">
                      <p style="margin:0;"> © Good Choice Car. All Rights Reserved.</p>
                    </td>
                  </tr>
                </table>
              </body>
              </html>
            `
    });


    return res.status(200).json({ message: "OTP sent successfully" });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
})




router.post("/otp/verify-otp", async (req, res) => {
  try {
    const { mail, otp } = req.body;

    // check fields
    if (!mail || !otp) {
      return res.status(400).json({ error: "Please provide both mail and otp" });
    }

    // already verified check
    const alreadyVerified = await VerifiedMail.findOne({ mail: mail.toLowerCase() });
    if (alreadyVerified) {
      return res.status(400).json({ error: "Mail is already verified" });
    }

    // find OTP in DB
    const foundOtp = await OTP.findOne({ mail: mail.toLowerCase(), otp });
    if (!foundOtp) {
      return res.status(400).json({ error: "Invalid OTP or mail" });
    }


    // check expiry 
    const now = Date.now();
    if (now - foundOtp.createdAt > 2 * 60 * 1000) {
      return res.status(400).json({ error: "OTP expired, please request a new one" });
    }


    // mark mail verified
    await VerifiedMail.create({ mail: mail.toLowerCase() });


    // delete OTP after successful verification
    await OTP.deleteMany({ mail: mail.toLowerCase() });

    return res.status(201).json({ msg: "Verification successful, mail verified" });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});






module.exports = { OtpRouter: router };
