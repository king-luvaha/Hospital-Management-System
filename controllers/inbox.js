const express = require ('express');
const router = express.Router();
const db = require.main.require ('./models/db_controller');
const bodyPaser = require ('body-parser');

router.get('*', function(req, res, next){
	if(req.cookies['username'] == null){
		res.redirect('/login');
	}else{
		next();
	}
});

router.get('/',function(req,res){
    db.getcomplain(function(err,result){
        res.render('inbox.ejs',{list :result});
    })
});

module.exports = router;