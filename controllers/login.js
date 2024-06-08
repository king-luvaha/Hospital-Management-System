const express = require('express');

const router = express.Router();
const bodyParser = require('body-parser');
const db = require.main.require('./models/db_controller');
const mysql = require('mysql');
const session = require('express-session');
const sweetalert = require('sweetalert2')
const {check, validationResult, body} = require('express-validator');

const con = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'hmsystem'
});

router.use(session({
    secret:'secret',
    resave: true,
    saveUninitialized: true
}))

router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json());

router.post('/', [
    check('username').notEmpty().withMessage("Username is required"),
    check('password').notEmpty().withMessage("Password is required")
], function(request, response) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(422).json({ errors: errors.array() });
    }

    const username = request.body.username;
    const password = request.body.password;

    if (username && password) {
        con.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
            if (error) {
                return response.status(500).json({ error: 'Database query error' });
            }
            if (results.length > 0) {
                request.session.loggedin = true;
                request.session.username = username;
                response.cookie('username', username);
                const status = results[0].email_status;
                if (status === "not_verified") {
                    response.status(401).json({ message: "Please verify your email" });
                } else {
                    response.json({ message: "Logged In", username: username });
                }
            } else {
                response.status(401).json({ message: 'Incorrect username or password' });
            }
        });
    } else {
        response.status(400).json({ message: 'Please enter username and password' });
    }
});

module.exports = router;