const express = require('express');
const router = express.Router();

//import in the Product model
const {Product} = require('../models');
const {createProductForm, bootstrapField} = require('../forms/index')

router.get('/', async function(req,res){
    //fetch all the products
    //use the bookshelf syntax
    let products = await Product.collection().fetch();
    res.render('products/index', {
        products: products.toJSON()
    })
})

router.get('/create', function(req,res){
    const productForm = createProductForm();
    res.render('products/create', {
        // get a html version of the form formatted using bootstrap
        form: productForm.toHTML(bootstrapField)
    })
})

router.post('/create', function(req,res){
    const productForm = createProductForm();
    productForm.handle(req, {
        // success is called if form has no validation errors
        // the form argumennt contains what the user has typed in
        'success': async function(form){

            // we need to do the eqv of INSERT INTO PRODUCTS(name, description, cost)
            // VALUES(form.data.name, form.data.description, form.data.cost)

            // THE MODEL represents the table
            // ONE instance of the MODEL represents a row 
            const product = new Product //create a new instance of the Product model (i.e. represents a new row)
            product.set('name', form.data.name);
            product.set('cost', form.data.cost);
            product.set('description', form.data.description);
            // must remember to save
            await product.save()
            res.redirect('/products')

        },
        // error function is called if the form has validation errors 
        'error': function(form){
            res.render('products/create', {
                form: form.toHTML(bootstrapField)
            })
        },
        // empty function is called if the form is not filled in at all
        'empty': function(form) {

        }
    });
})

module.exports = router;