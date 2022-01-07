const express = require('express');
const router = express.Router();
const {
    ensureAuthenticated
} = require('../config/auth');
const User = require('../models/User');
const Question = require('../models/Question');

//  Welcome
router.get('/', (req, res) => res.render('welcome'));


//  Dashboard
router.get('/instructions', ensureAuthenticated, (req, res) => res.render('instructions', {
    name: req.user.name
}));

router.get('/questions', ensureAuthenticated,async (req, res) =>{

    let errors = [];
    
    const user = await User.findOne({
        email: req.user.email
    })

    console.log(user)
    if(user.responsee.length == 0){
        let ques = [];
        const aptitude = await Question.find({
            domain: "aptitude"
        });
        console.log(aptitude);
        ques.push(aptitude);
        const general = await Question.find({
            domain: "general"
        });
        ques.push(general);
        if(user.TechnicalCSE == "on"){
            let q = await Question.find({
                domain: "cse"
            });
            ques.push(q);
        }
        if(user.TechnicalElectrical == "on"){
            let q = await Question.find({
                domain: "elec"
            });
            ques.push(q);
        }
        if(user.Management == "on"){
            let q = await Question.find({
                domain: "mgm"
            });
            ques.push(q);
        }
        if(user.Design == "on"){
            let q = await Question.find({
                domain: "des"
            });
           const qselc = q.sort(() => Math.random() - Math.random()).slice(0, 4)

            ques.push(qselc);
        }

        res.render('questions', {
            questions:ques,
            name: req.user.name
        })
    } else {
        errors.push({
            msg: 'You have already attempted the test'
        });
        res.render('welcome', {
            errors,
        })
    }
});

router.post('/questions', (req, res) => {
     const newQuestion = new Question({
            que: req.body.que,
            domain: req.body.domain,
            optionA: req.body.optionA,
            optionB: req.body.optionB,
            optionC: req.body.optionC,
            optionD: req.body.optionD,
            image : req.body.image
     }
        );
        newQuestion.save()
        .then(
            res.send("Success")
        )
            
});

router.get("/thankyou", (req, res) => {
    res.render("thankyou");
});

   
router.post("/thankyou", async (req, res) => {
    let data = req.body;
  
    const user = await User.findOne({
        email: req.user.email
    })
    
    
    user.updateOne({
        $set: {
            responsee: data
        }
    })
    .catch(
        err => console.log(err)
    )

    res.render("thankyou");
});

module.exports = router;