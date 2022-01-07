const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');

//  User model
const User = require('../models/User');


//  Login Page
router.get('/login', (req, res) => res.render('login'));

//  Register Page
router.get('/register', (req, res) => res.render('register'));

//  Register Handle
router.post('/register', (req, res) => {
    const {
        name,
        regno,
        email,
        phno,
        TechnicalCSE,
        TechnicalElectrical,
        Management,
        Design,
        password,
    } = req.body;
    
    console.log(req.body);
    let errors = [];
   

    if(!TechnicalCSE & !TechnicalElectrical & !Management & !Design ) {
        errors.push({ msg: 'Please select atleast one domain' });
        res.render('register', {
            errors,
        })
    }else {
        User.findOne({
            email: email
        })
        .then(user => {
            if (user) {
                //  User exists
                errors.push({
                    msg: 'Email is already registered'
                });
                res.render('register', {
                    errors,
                })
            } else {
                const newUser = new User({
                    name,
                    regno,
                    email,
                    phno,
                    TechnicalCSE,
                    TechnicalElectrical,
                    Management,
                    Design,
                    password,
                });

                //  Hash Password
                bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;

                    //  set pass to hash
                    newUser.password = hash;
                    //  save the user
                    newUser.save()
                        .then(user => {
                            req.flash('success_msg', 'You are now registered and can log in');
                            res.redirect('/users/login');
                        })
                        .catch(err => console.log(err));
                }))
            }
        })
    }

        
    
});

//  Login handle
router.post('/login', (req, res, next) => {
    
    passport.authenticate('local', {
        successRedirect: '/instructions',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

//  Logout handle
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
})

module.exports = router;