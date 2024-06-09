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
    db.getAllemployee(function(err,result){
        res.render('salary.ejs',{employee : result});
    })
});

router.get('/generateslip/:id',function(req,res){
    const id = req.params.id;
    db.getEmpbyId(id,function(err,result){
        const name = result[0].name;
        const id = result[0].id;
        const email = result[0].email;
        const role = result[0].role;
        const salary = result[0].salary;
        const join_date = result[0].join_date;
        const contact = result[0].contact;
        res.render('payslip.ejs',{name : name,id:id,email:email,role:role,salary:salary,join_date:join_date,contact:contact});
    });
    
});

module.exports =router;