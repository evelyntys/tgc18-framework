const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const generateAccessToken = function (username, id, email, tokenSecret, expiry) {
    // 1st arg -- payload of whatever data you want to store in jwt
    // PAYLOAD IS PUBLIC -- NOT SECURE
    return jwt.sign({
        username: username,
        id: id,
        email: email
    }, tokenSecret, {
        expiresIn: expiry
    })
}

const getHashedPassword = function (password) {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash
}

const { User } = require('../../models');
const { checkIfAuthenticatedwithJWT } = require('../../middlewares');

router.post('/login', async function (req, res) {
    const user = await User.where({
        email: req.body.email,
        password: getHashedPassword(req.body.password)
    }).fetch({
        require: false
    });
    // if the user with the provided email and password is found
    if (user){
        // create the JWT
        const accessToken = generateAccessToken(user.get('username'),
        user.get('id'), 
        user.get('email'), 
        process.env.TOKEN_SECRET, 
        '1h');
        res.json({
            accessToken: accessToken
        })
    }
    else{
        // error
        res.status(401);
        res.json({
            error: 'invalid email or password'
        })
    }
})

router.get('/profile', checkIfAuthenticatedwithJWT, function(req,res){
    const user = req.user;
    res.json(user);
})

module.exports = router;