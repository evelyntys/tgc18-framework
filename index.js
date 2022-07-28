const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
require('dotenv').config();
var helpers = require('handlebars-helpers')({
    handlebars: hbs.handlebars
  });

const app = express();
app.set('view engine', 'hbs');

//static folder
app.use(express.static('public'))

//setup wax-on
wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts');

// when get req, will match the routes one by one 
// => match all in landingRoutes first, then change to productRoutes if cannot find

// first arg is the prefix
const landingRoutes = require('./routes/landing') 
// => router object is returned into landingRoutes
app.use('/', landingRoutes)

const productRoutes = require('./routes/products')
app.use('/products', productRoutes)


//enable forms
app.use(
    express.urlencoded({
        extended: false
    })
)

// async function main() {

//     app.get('/', async function (req, res) {
//         res.send('hello world')
//     })

// }

// main();

app.listen(3000, function () {
    console.log('server started')
})