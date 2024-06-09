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

module.exports.findOne = function (email, callback) 
{
    const query = "SELECT * FROM users where email='" + email + "'";
    con.query(query, callback);
    console.log(query);
};

module.exports.temp = function (id, email, token, callback) 
{
    const query =
        "insert into `temp` (`id`,`email`,`token`) values ('" +
        id +
        "','" +
        email +
        "','" +
        token +
        "')";
    con.query(query, callback);
};

module.exports.add_doctor = function (
    first_name,
    last_name,
    email,
    dob,
    gender,
    address,
    phone,
    image,
    department,
    biography,
    callback
  ) {
    const query =
      "INSERT INTO `doctor`(`first_name`,`last_name`,`email`,`dob`,`gender`,`address`,`phone`,`image`,`department`,`biography`) values ('" +
      first_name +
      "','" +
      last_name +
      "','" +
      email +
      "','" +
      dob +
      "','" +
      gender +
      "','" +
      address +
      "','" +
      phone +
      "','" +
      image +
      "','" +
      department +
      "','" +
      biography +
      "')";
    con.query(query, callback);
    console.log(query);
};

module.exports.getAllDoc = function (callback) {
    const query = "select * from doctor";
    con.query(query, callback);
};

module.exports.getDocbyId = function (id, callback) {
    const query = "select * from doctor where id =" + id;
    con.query(query, callback);
};

module.exports.editDoc = function (
    id,
    first_name,
    last_name,
    email,
    dob,
    gender,
    address,
    phone,
    image,
    department,
    biography,
    callback
  ) {
    const query =
      "update `doctor` set `first_name`='" +
      first_name +
      "', `last_name`='" +
      last_name +
      "', `email`='" +
      email +
      "', `dob`='" +
      dob +
      "',`gender`='" +
      gender +
      "',`address`='" +
      address +
      "',`phone`='" +
      phone +
      "',`image`='" +
      image +
      "',`department`='" +
      department +
      "',`biography`='" +
      biography +
      "' where id=" +
      id;
    con.query(query, callback);
    // console.log(query);
};

module.exports.deleteDoc = function (id, callback) {
    //console.log("i m here");
    const query = "delete from doctor where id=" + id;
    con.query(query, callback);
};


module.exports.searchDoc = function (key, callback) {
    const query = 'SELECT * from doctor where first_name like "%' + key + '%"';
    con.query(query, callback);
    console.log(query);
};

module.exports.getalldept = function (callback) {
    const query = "select * from departments";
    con.query(query, callback);
};

module.exports.getleavebyid = function (id, callback) {
    const query = "select * from leaves where id=" + id;
    con.query(query, callback);
};

module.exports.getAllLeave = function (callback) {
    const query = "Select * from leaves";
    con.query(query, callback);
};

module.exports.add_leave = function (
    name,
    id,
    type,
    from,
    to,
    reason,
    callback
  ) {
    const query =
      "Insert into `leaves` (`employee`,`emp_id`,`leave_type`,`date_from`,`date_to`,`reason`) values ('" +
      name +
      "','" +
      id +
      "','" +
      type +
      "','" +
      from +
      "','" +
      to +
      "','" +
      reason +
      "')";
    console.log(query);
    con.query(query, callback);
};
  

module.exports.deleteleave = function (id, callback) {
    const query = "delete  from leaves where id=" + id;
    con.query(query, callback);
};

module.exports.getAllemployee = function (callback) {
    const query = "select * from employee";
    con.query(query, callback);
};

  module.exports.add_employee = function (
    name,
    email,
    contact,
    join_date,
    role,
    salary,
    callback
  ) {
    const query =
      "Insert into `employee` (`name`,`email`,`contact`,`join_date`,`role`,`salary`) values ('" +
      name +
      "','" +
      email +
      "','" +
      contact +
      "','" +
      join_date +
      "','" +
      role +
      "','" +
      salary +
      "')";
    con.query(query, callback);
    console.log(query);
};

module.exports.searchEmp = function (key, callback) {
    const query = 'SELECT * from employee where name like "%' + key + '%"';
    con.query(query, callback);
    console.log(query);
};

module.exports.deleteEmp = function (id, callback) {
    //console.log("i m here");
    var query = "delete from employee where id=" + id;
    con.query(query, callback);
};

module.exports.editEmp = function (
    id,
    name,
    email,
    contact,
    join_date,
    role,
    callback
  ) {
    const query =
      "update `employee` set `name`='" +
      name +
      "', `email`='" +
      email +
      "', `contact`='" +
      contact +
      "', `join_date`='" +
      join_date +
      "', `role`='" +
      role +
      "' where id=" +
      id;
    con.query(query, callback);
};

module.exports.getEmpbyId = function (id, callback) {
    const query = "select * from employee where id =" + id;
    con.query(query, callback);
};

module.exports.edit_leave = function (
    id,
    name,
    leave_type,
    from,
    to,
    reason,
    callback
  ) {
    const query =
      "update leaves set employee='" +
      name +
      "',leave_type='" +
      leave_type +
      "',date_from='" +
      from +
      "',date_to='" +
      to +
      "',reason='" +
      reason +
      "' where id=" +
      id;
    con.query(query, callback);
};

module.exports.add_appointment = function (
    p_name,
    department,
    d_name,
    date,
    time,
    email,
    phone,
    callback
  ) {
    const query =
      "insert into appointment (patient_name,department,doctor_name,date,time,email,phone) values ('" +
      p_name +
      "','" +
      department +
      "','" +
      d_name +
      "','" +
      date +
      "','" +
      time +
      "','" +
      email +
      "','" +
      phone +
      "')";
    con.query(query, callback);
};

module.exports.getallappointment = function (callback) {
    const query = "select * from appointment";
    con.query(query, callback);
};

module.exports.editappointment = function (
    id,
    p_name,
    department,
    d_name,
    date,
    time,
    email,
    phone,
    callback
  ) {
    const query =
      "update appointment set patient_name='" +
      p_name +
      "',department='" +
      department +
      "',doctor_name='" +
      d_name +
      "',date='" +
      date +
      "',time='" +
      time +
      "',email='" +
      email +
      "',phone='" +
      phone +
      "' where id=" +
      id;
    con.query(query, callback);
};

module.exports.deleteappointment = function (id, callback) {
    const query = "delete from appointment where id=" + id;
    con.query(query, callback);
};

module.exports.getallmed = function (callback) {
    const query = "select *from store order by id desc";
    console.log(query);
    con.query(query, callback);
};

module.exports.addMed = function (
    name,
    p_date,
    expire,
    e_date,
    price,
    quantity,
    callback
  ) {
    const query =
      "Insert into `store` (name,p_date,expire,expire_end,price,quantity) values('" +
      name +
      "','" +
      p_date +
      "','" +
      expire +
      "','" +
      e_date +
      "','" +
      price +
      "','" +
      quantity +
      "')";
    console.log(query);
    con.query(query, callback);
};

module.exports.getMedbyId = function (id, callback) {
    var query = "select * from store where id=" + id;
    con.query(query, callback);
};

module.exports.editmed = function (
    id,
    name,
    p_date,
    expire,
    e_date,
    price,
    quantity,
    callback
  ) {
    var query =
      "update store set name='" +
      name +
      "', p_date='" +
      p_date +
      "',expire='" +
      expire +
      "' ,expire_end='" +
      e_date +
      "',price='" +
      price +
      "',quantity='" +
      quantity +
      "' where id=" +
      id;
    console.log(query);
    con.query(query, callback);
};

module.exports.deletemed = function (id, callback) {
    //console.log("i m here");
    var query = "delete from store where id=" + id;
    con.query(query, callback);
};

module.exports.searchmed = function (key, callback) {
    var query = 'SELECT  *from store where name like "%' + key + '%"';
    con.query(query, callback);
};

module.exports.postcomplain = function (
    message,
    name,
    email,
    subject,
    callback
  ) {
    var query =
      "insert into complain (message,name,email,subject) values ('" +
      message +
      "','" +
      name +
      "','" +
      email +
      "','" +
      subject +
      "')";
    console.log(query);
    con.query(query, callback);
};

module.exports.getcomplain = function (callback) {
    var query = "select * from complain";
    con.query(query, callback);
};