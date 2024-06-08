const mysql = require('mysql');
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const con = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'hmsystem'
});

con.connect(function(err){
    if(err){
        throw err;
    }
    else{    
        console.log('Database Connected')
    }
})

module.exports.signup = function(username, email, password, status, callback) {
    con.query('SELECT email FROM users WHERE email = ?', [email], function(err, result) {
        if (err) return callback(err);
        if (result.length === 0) {
            const query = 'INSERT INTO `users` (`username`, `email`, `password`, `email_status`) VALUES (?, ?, ?, ?)';
            con.query(query, [username, email, password, status], function(err, result) {
                if (err) return callback(err);

                const userId = result.insertId; // Get the last inserted id
                console.log('New User ID:', userId);
                callback(null, userId);
            });
        } else {
            callback(new Error('Email already exists'));
        }
    });
};

module.exports.verify = function(username, email, token, callback) {
    const query = 'INSERT INTO `verify` (`username`, `email`, `token`) VALUES (?, ?, ?)';
    con.query(query, [username, email, token], callback);
};

module.exports.getuserid = function(email, callback) {
    const query = 'SELECT * FROM `verify` WHERE email = ?';
    con.query(query, [email], callback);
};

module.exports.matchtoken = function(id, token, callback) {
    const query = 'SELECT * FROM `verify` WHERE id = ? AND token = ?';
    con.query(query, [id, token], function(err, result) {
        if (err) {
            console.error('Database error during token matching:', err);
            return callback(err, null);
        }

        console.log('Database match result:', result);

        callback(null, result);
    });
};

module.exports.updateverify = function(email, email_status, callback) {
    const query = 'UPDATE `users` SET `email_status` = ? WHERE `email` = ?';
    con.query(query, [email_status, email], callback);
};