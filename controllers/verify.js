const express = require ('express');
const router = express.Router();
const bodyParser = require('body-parser');
const db = require.main.require ('./models/db_controller');

router.use(bodyParser.urlencoded({extended : true}));
router.use(bodyParser.json());

// router.get('/',function(req,res){
//     res.render('verify.ejs');
// });

router.post('/',function(req,res){
    const { id, token } = req.body;

    console.log(`Received ID: ${id}, Token: ${token}`);

    db.matchtoken(id,token,function(err,result){

        if (err) {
            console.error('Database error during token matching:', err);
            return res.status(500).json({ error: 'Database error during token matching' });
        }

        console.log('Database match result:', result);

        if (result.length > 0){
            const email = result[0].email;
            const email_status = "Verified";

            db.updateverify(email, email_status, function(err, result1) {
                if (err) {
                    console.error('Database error during email verification update:', err);
                    return res.status(500).json({ error: 'Database error during email verification update' });
                }

                res.send("Email Verified");
            });
        }
        else {
            res.send('Token does not match');
        }
    });
});

module.exports = router;