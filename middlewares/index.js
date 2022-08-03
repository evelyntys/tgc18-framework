const jwt = require('jsonwebtoken');

const checkIfAuthenticated = function (req, res, next) {
    const user = req.session.user;
    if (!user) {
        req.flash('error_messages', 'only logged in users may view this page');
        res.redirect('/users/login')
    } else {
        next()
    }
}

const checkIfAuthenticatedwithJWT = function (req, res, next) {
    // extract out the authorization headers
    const authHeader = req.headers.authorization;
    if (authHeader){
        // extract out the jwt and check whether it is valid
        // example of auth header => BEARER eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpvbnNub3ciLCJpZCI6MTUsImVtYWlsIjoiam9obnNub3dAZW1haWwuY29tIiwiaWF0IjoxNjU5NDk4MjQ4LCJleHAiOjE2NTk1MDE4NDh9.hAjKb_ChPPWgVLimu4F5Thmw3gm49iUDyNsMP0KsUAg
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.TOKEN_SECRET, function(err,tokenData){
            // err argument -- is null if there is no error
            // tokenData argument -- is the data we embedded into jwt as the payload
            if (err){
                res.status(401);
                res.json({
                    error: 'invalid access token'
                })
            } else{
                // if the token is valid
                req.user = tokenData;
                next()
            }
        })
        next();
    } else{
        res.status(401);
        res.json({
            error: 'no authorization headers found'
        })
    }
}

module.exports = { checkIfAuthenticated, checkIfAuthenticatedwithJWT }