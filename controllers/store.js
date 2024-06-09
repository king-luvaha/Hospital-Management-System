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
    db.getallmed(function(err,result){
        res.render('store.ejs',{list : result});
    })
    
});

router.get('/add_med',function(req,res){
    res.render('add_med.ejs');
});

router.post('/add_med',function(req,res){
    const name = req.body.name;
    const p_date = req.body.p_date;
    const expire = req.body.expire;
    const e_date = req.body.e_date;
    const price = req.body.price;
    const quantity = req.body.quantity;
   
    db.addMed(name,p_date,expire,e_date,price,quantity,function(err,result){
       res.redirect('/store');
    });
   
});

router.get('/edit_med/:id',function(req,res){
    const id = req.params.id;
    db.getMedbyId(id,function(err,result){
        
        res.render('edit_med.ejs' ,{list : result});
    });
});

router.post('/edit_med/:id',function(req,res){
    const id = req.params.id;
    db.editmed(id,req.body.name,req.body.p_date,req.body.expire,req.body.e_date,req.body.price,req.body.quantity,function(err,result){
        res.redirect('/store');
    });

});

router.get('/delete_med/:id',function(req,res){
    const id = req.params.id;
    db.getMedbyId(id,function(err,result){
        
        res.render('delete_med.ejs' ,{list : result});
    });
});

router.post('/delete_med/:id',function(req,res){
    const id = req.params.id;
    
    db.deletemed(id,function(err,result){
        res.redirect('/store');
    });

});

router.post('/search',function(req,res){
    const key = req.body.search;
    db.searchmed(key,function(err,result){
        console.log(result);
        
        res.render('store.ejs',{list : result});
    });
});

module.exports = router ;