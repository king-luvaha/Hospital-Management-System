const express = require('express');
const flash = require ('flash');
const router = express.Router();
const bodyParser = require('body-parser');
//const async = require ('async');
const nodemailer = require('nodemailer');
//const crypto = require ('crypto');
const randomToken = require ('random-token');
const db = require.main.require ('./models/db_controller');

// router.get('/',function(req,res){
//     res.render('resetpassword.ejs');
// });

router.post('/',function(req,res){

    const email = req.body.email;
    db.findOne(email,function(err,result1){
       // console.log(result);
        if(!result1){
           console.log("Mail does not exist");
            // res.redirect('back');
            res.send("Mail does not exist")
        }
        const id = result1[0].id;
        const email = result1[0].email;
        const token = randomToken(8);
        db.temp(id,email,token,function(err,result2){
            var output =  `
            <p>Dear User, </p>
            <p>Your are receiving this email because you had requested to reset your password.</p>
            <p>Your new password has been generated. Please login using the given new password.</p>
            <ul>
                <li>User ID: `+ id + `</li>
                <li>Token: `+ token + `</li>
            </ul>
            <p>Login Link: <a href="http://localhost:3000/login">LOGIN</a></p>
            <p>You may change your password after you login under the section - ACCOUNT SETTINGS</p>
            <p><strong>This is an automatically generated mail. Please do not reply back.</strong></p>
            
            <p>Regards,</p>
            <p>Hospital Manager</p>
        `;
        
        const transporter = nodemailer.createTransport({
            service : 'gmail',
            auth: {
                user: 'luvaha456@gmail.com',
                pass: 'wgql vnfk vvcg rydd'
            }

        });

        const mailOptions = {

            from: 'Hospital Management Team', // sender address
            to: email, // list of receivers
            subject: 'Password Reset', // Subject line
            html: output// plain text body
        };

        transporter.sendMail(mailOptions,function(err,info){
            if(err) {
                return console.log(err);
            }
            console.log(info);
        });

        });

    })

    res.send("A Token has been sent to your account");
    
    
});

module.exports = router;