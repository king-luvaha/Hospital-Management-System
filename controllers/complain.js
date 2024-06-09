const mysql =require('mysql');
const express = require ('express');
const cookie = require ('cookie-parser');
const db = require.main.require ('./models/db_controller');

const router = express.Router();

router.get('*', function(req, res, next){
	if(req.cookies['username'] == null){
		res.redirect('/login');
	}else{
		next();
	}
});

router.get('/',function(req,res){
    res.render ('complain.ejs');
});

router.post('/',function(req,res){
    const message = req.body.message;
    const name = req.body.name;
    const email = req.body.email;
    const subject = req.body.subject;

    db.postcomplain(message,name,email,subject,function(err,result){
        res.redirect('back');
    });
});


module.exports = router;
