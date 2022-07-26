const express = require('express');
const { createUserForm, bootstrapField, createLoginForm } = require('../forms');
const { User } = require('../models');
const router = express.Router();
const crypto = require('crypto');

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    // output will be converted to hexdecimal (if not, will be too long, a very huge number)
    const hash = sha256.update(password).digest('base64');
    return hash;
}

router.get('/signup', async function(req,res){
    const userForm = createUserForm()
    res.render('users/signup', {
        form: userForm.toHTML(bootstrapField)
    })
})

router.post('/signup', async function(req,res){
    const userForm = createUserForm();
    userForm.handle(req, {
        success: async function(form){
            // create an instance of the user model
            // Model -> the table
            // an instance of the model -> one row 
            const user = new User();
            // user.set('username', form.data.username);
            // user.set('password', form.data.password);
            // user.set('email', form.data.email);
            // user.set(form.data); <= not so good in this case because form.data also contains the form.data.confirm_password field
            const {confirm_password, ...userData} = form.data;
            userData.password = getHashedPassword(userData.password)
            user.set(userData)
            await user.save();
            req.flash('success_messages', 'you have signed up successfully');
            res.redirect('/users/login')
            
        },
        error: function(form){
            res.render('users/signup', {
                form: userForm.toHTML(bootstrapField)
            })
        },
        empty: function(form){
            res.render('users/signup', {
                form: userForm.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/login', async function(req,res){
    const loginForm = createLoginForm();
    res.render('users/login', {
        form: loginForm.toHTML(bootstrapField)
    })
    
})

router.post('/login', async function(req,res){
    const loginForm = createLoginForm();
    loginForm.handle(req, {
        success: async function(form){
            const user = await User.where({
                email: form.data.email,
                password: getHashedPassword(form.data.password)
            }).fetch({
                require: false //if no result is found, then it will return null
            })
            // check if the user does not exist
            if (!user){
                req.flash('error_messages', 'invalid credentials');
                res.redirect('/users/login')
            }
            else{
                req.session.user = {
                    id: user.get('id'),
                    email: user.get('email'),
                    username: user.get('username')
                }
                req.flash('success_messages', 'welcome back, ' + user.get('username'));
                res.redirect('/products')
            }
        }
    })

})

router.get('/profile', async function(req,res){
    const user = req.session.user;
    if (!user){
        req.flash('error_messages', 'only logged in users may view this page');
        res.redirect('/users/login')
    } else{
        res.render('users/profile',{
            user: req.session.user
        })
    }
})

router.get('/logout', async function(req,res){
    req.session.user = null;
    req.flash('success_messages', 'you have been logged out');
    res.redirect('/users/login')
})

module.exports = router