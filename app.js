const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');
const ejs = require('ejs');
const multer = require('multer');
const async = require('async');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
const sweetalert = require('sweetalert2');
const http = require('http');
const db = require('./models/db_controller');
const signup = require('./controllers/signup');
const login = require('./controllers/login');
const verify = require('./controllers/verify');

const app = express();

app.set('view engine', 'ejs');
const server = http.createServer(app);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Import the signup router
app.use('/signup', signup);

// Import the login router
app.use('/login', login);

// Import verify router
app.use('/verify', verify);

