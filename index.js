const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
require('dotenv').config();
var helpers = require('handlebars-helpers')({
    handlebars: hbs.handlebars
});

require('dotenv').config();

// const cartsDAL = require('./dal/carts')

//   requiring in dependencies for sessions
const session = require('express-session');
const flash = require('connect-flash');
// create a new session FileStore
const FileStore = require('session-file-store')(session);
// need sessions for csrf to work
const csrf = require('csurf');
const { checkIfAuthenticated } = require('./middlewares/index')

const app = express();
app.set('view engine', 'hbs');

// app.use(urlencoded: )
app.use(express.urlencoded({
    extended: false
}))

//static folder
app.use(express.static('public'))

//setup wax-on
wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts');

// set up sessions
app.use(session({
    store: new FileStore(), // use files to store sessions
    secret: process.env.SESSION_SECRET, //used to generate the session id,
    resave: false, //do we automantically recreate the seesion even if there is no change to it
    saveUninitialized: true, //if a new browser connects, do we create a new session
}))

// app.use(function (req, res, next) {
//     console.log('req.body => ', req.body);
//     next()
// })

// app.use(function(req,res,next){
//     res.locals.cloudinaryAPIKey = process.env.CLOUDINARY_API_KEY
// })

app.use(csrf());
app.use(function (req, res, next) {
    res.locals.csrfToken = req.csrfToken();
    // console.log(req.csrfToken())
    next();
})

// register flash messages
app.use(flash()); //IMPORTANT: register flash after sessions as flash needs sessions to work

// setup a middleware to inject the session data into the hbs files
app.use(function (req, res, next) {
    // res.locals will contain all the variables available to hbs files
    res.locals.success_messages = req.flash('success_messages');
    res.locals.error_messages = req.flash('error_messages');
    next();
    // RMB TO CALL NEXT FOR MIDDLEWARES
})

// set up middleware to share data across all hbs files
app.use(function(req,res,next){
    // whatever is placed in local response, is available in all hbs files
    // have to ensure that this only happens after you enable sessions
    res.locals.user = req.session.user;
    next();
})

app.use(async function(req,res,next){
    if (req.session.user){
        const cartItems = await getCart(req.session.user.id);
        res.locals.cartCount = cartItems.toJSON().length;
        next()
    }
})

// when get req, will match the routes one by one 
// => match all in landingRoutes first, then change to productRoutes if cannot find

// first arg is the prefix
const landingRoutes = require('./routes/landing')
// => router object is returned into landingRoutes
app.use('/', landingRoutes)

const productRoutes = require('./routes/products')
app.use('/products', productRoutes)

const userRoutes = require('./routes/users');
const { urlencoded } = require('express');
app.use('/users', userRoutes)

const cloudinaryRoutes = require('./routes/cloudinary')
app.use('/cloudinary', cloudinaryRoutes)
//enable forms

const cartRoutes = require('./routes/carts')
app.use('/cart', checkIfAuthenticated, cartRoutes)

const checkoutRoutes = require('./routes/checkout');
const { getCart } = require('./dal/carts');
app.use('/checkout', checkIfAuthenticated, checkoutRoutes)

// async function main() {

//     app.get('/', async function (req, res) {
//         res.send('hello world')
//     })

// }

// main();


app.listen(3000, function () {
    console.log('server started')
})