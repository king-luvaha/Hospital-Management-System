const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const db = require.main.require('./models/db_controller');
const mysql = require('mysql');
const nodemailer = require('nodemailer');
const randomToken = require('random-token')
const {check, validationResult, body} = require('express-validator');

router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json());

router.post('/', [
    check('username').notEmpty().withMessage("Username is Required"),
    check('password').notEmpty().withMessage("Password is Required"),
    check('email').notEmpty().withMessage("Email is Required")
], function(req, res) {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({errors: errors.array() });
    }

    const email_status = "Not Verified";
    const { email, username, password } = req.body;

    db.signup(username, email, password, email_status, (err, result) => {
        if (err) {
            return res.status(500).json({ errors: [{ msg: 'Error during signup' }] });
        }

        const userId = result.insertId;
        
        const token = randomToken(8);
        db.verify(username, email, token, (err, result) => {
            if (err) {
                return res.status(500).json({ errors: [{ msg: 'Error during token generation' }] });
            }

            db.getuserid(email, (err, result) => {
                if (err) {
                    return res.status(500).json({ errors: [{ msg: 'Error retrieving user ID' }] });
                }

                const id = result[0].id;
                const output = `
                    <p>Dear ${username},</p>
                    <p>Thanks for Signing Up. Your Verification ID and token are given below:</p>
                    <ul>
                        <li>User ID: ${id}</li>
                        <li>Token: ${token}</li>
                    </ul>
                    <p>Verify link: <a href="http://localhost:3000/verify">Verify</a></p>
                    <p>This is an automatically generated email.</p>
                `;

                const transporter = nodemailer.createTransport({
                    host: "smtp.gmail.com",
                    port: 465,
                    secure: true,
                    auth: {
                        user: "luvaha456@gmail.com",
                        pass: "wgql vnfk vvcg rydd"
                    }
                });

                const mailOptions = {
                    from: 'luvaha456@gmail.com',
                    to: email,
                    subject: 'Email Verification',
                    html: output
                };

                transporter.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        return res.status(500).json({ errors: [{ msg: 'Error sending email' }] });
                    }
                    res.send("Check your email for token verification");
                });
            });
        });
    });
});

module.exports = router;