const express = require('express');

//create a router object
//a router object can contain routes
const router = express.Router();

router.get('/', function(req,res){
    res.render('landing/index');
})

router.get('/about-us', function(req,res){
    res.render('landing/about-us')
})

router.get('/contact-us', function(req,res){
    res.render('landing/contact-us')
})

module.exports = router;
// have one route file for crud of one category e.g. actors, films