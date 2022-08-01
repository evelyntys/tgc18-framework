const express = require('express');
const router = express.Router();

//import in the Product model
const { Product, Category, Tag } = require('../models');
const { createProductForm, createSearchForm, bootstrapField } = require('../forms/index');
const { checkIfAuthenticated } = require('../middlewares');

const dataLayer = require('../dal/products')

router.get('/', async function (req, res) {
    const categories = await dataLayer.getAllCategories();
    categories.unshift([0, '-----any category-----'])
    
    const tags = await dataLayer.getAllTags()
    // inserts something at the start of the array

    //fetch all the products
    //use the bookshelf syntax
    // let products = await Product.collection().fetch({
    //     withRelated: ['category', 'tags'] //relationship name
    // });

    // create an instance of the search form
    const searchForm = createSearchForm(categories, tags);

    // create a query builder
    let query = Product.collection(); // => creates a query builder

    // search logic begins here
    searchForm.handle(req, {
        success: async function (form) {
            // if the user did provide the name
            if (form.data.name){
                query.where('name', 'like', '%' + form.data.name + '%')
            }

            if (form.data.min_cost){
                query.where('cost', '>=', form.data.min_cost)
            }

            if (form.data.max_cost){
                query.where('cost', '<=', form.data.max_cost)
            }

            if (form.data.category_id && form.data.category_id !="0"){
                query.where('category_id', '=', form.data.category_id)
            }

            if (form.data.tags){
                // first arg: sql clause
                // second arg: which table?
                // third arg: one of the keys
                // fourth arg: the key to join with
                // eqv. select * from products join products_tags on products.id = product_id where
                // tag_id in (selected tags id)
                // this method looks for OR: if the tag exists, then it will show up
                query.query('join', 'products_tags', 'products.id', 'product_id')
                .where('tag_id', 'in', form.data.tags.split(','))
            }

            const products = await query.fetch({
                withRelated: ['tags', 'category']
            })

            res.render('products/index', {
                products: products.toJSON(),
                form: form.toHTML(bootstrapField)
            })
        },
        empty: async function () {
            const products = await query.fetch({
                withRelated: ['tags', 'category']
            })
            res.render('products/index', {
                products: products.toJSON(),
                form: searchForm.toHTML(bootstrapField)
            })
        },
        error: async function () {

        }
    })

})

router.get('/create', checkIfAuthenticated, async function (req, res) {
    // fetch all the categories in the system
    const categories = await dataLayer.getAllCategories(); // fetchAll instead of fetch because want ALL the categories

    const tags = await dataLayer.getAllTags();
    // const c = [];
    // for (let c of (await Category.fetchAll())){
    //     c.push([c.get('id'), c.get('name')])
    // }
    const productForm = createProductForm(categories, tags);
    res.render('products/create', {
        // get a html version of the form formatted using bootstrap
        form: productForm.toHTML(bootstrapField),
        cloudinaryName: process.env.CLOUDINARY_NAME,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
    })
})

router.post('/create', checkIfAuthenticated, async function (req, res) {
    const tags = await getAllTags();
    // fetch all the categories in the system
    const categories = await getAllCategories(); // fetchAll instead of fetch because want ALL the categories

    // const c = [];
    // for (let c of (await Category.fetchAll())){
    //     c.push([c.get('id'), c.get('name')])
    // }
    const productForm = createProductForm(categories, tags);
    productForm.handle(req, {
        // success is called if form has no validation errors
        // the form argumennt contains what the user has typed in
        'success': async function (form) {

            // we need to do the eqv of INSERT INTO PRODUCTS(name, description, cost)
            // VALUES(form.data.name, form.data.description, form.data.cost)

            // THE MODEL represents the table
            // ONE instance of the MODEL represents a row 
            const product = new Product //create a new instance of the Product model (i.e. represents a new row)
            product.set('name', form.data.name);
            product.set('cost', form.data.cost);
            product.set('description', form.data.description);
            product.set('category_id', form.data.category_id);
            product.set('image_url', form.data.image_url)
            // must remember to save
            await product.save()
            if (form.data.tags) {
                await product.tags().attach(form.data.tags.split(','))
            }
            // req.flash is available because we did a app.use(flash()) inside index.js
            req.flash("success_messages", `new product ${product.get('name')} has been created`)
            res.redirect('/products')

        },
        // error function is called if the form has validation errors 
        'error': function (form) {
            res.render('products/create', {
                form: form.toHTML(bootstrapField)
            })
        },
        // empty function is called if the form is not filled in at all
        'empty': function (form) {

        }
    });
})

// target url: /products/:product_id/update
router.get('/:product_id/update', async function (req, res) {
    // 1. get the product that is being updated
    // select * from Product
    // bookshelf ORM
    const categories = await dataLayer.getAllCategories()
    const product = await dataLayer.getProductByID(req.params.product_id)
    // Product.where({
    //     'id': req.params.product_id
    // }).fetch({
    //     withRelated: ['tags'],
    //     require: true //if not found, will cause an exception (aka an error)
    // })

    const tags = await dataLayer.getAllTags();
    // 2. create the form to update the product
    const productForm = createProductForm(categories, tags);
    // 3. fill the form with the previous values of the product
    productForm.fields.name.value = product.get('name');
    productForm.fields.cost.value = product.get('cost');
    productForm.fields.description.value = product.get('description');
    productForm.fields.category_id.value = product.get('category_id');
    productForm.fields.image_url.value = product.get('image_url');

    // fill in multi-select for tags
    // product.related('tags) will return an array of tag objects
    // use pluck to retrieve only the id from each product
    let selectedTags = await product.related('tags').pluck('id');
    console.log(selectedTags)
    productForm.fields.tags.value = selectedTags;

    res.render('products/update', {
        form: productForm.toHTML(bootstrapField),
        product: product.toJSON(),
        cloudinaryName: process.env.CLOUDINARY_NAME,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
    })
})

router.post('/:product_id/update', async function (req, res) {
    const productForm = createProductForm();
    const product = await dataLayer.getProductByID(req.params.product_id)
    // handle function will run the validation on the data
    productForm.handle(req, {
        success: async function (form) {
            // the form arguments contain whatever the user has typed into the form
            // update products set name=?, cost=?, description=? where product_id=?
            // product.set('name', form.data.name);
            // product.set('description', form.data.description);
            // product.set('cost', form.data.cost);
            // product.set('image_url', form.data.image_url);
            let { tags, ...productData } = form.data;
            // dont have to change since image_url is included in productData
            product.set(productData)
            // for shortcut to work, all the keys in form.data object must be a column name in the table
            // product.set(form.data)
            await product.save();
            // get all the selected tags as an array 
            let tagIds = tags.split(',').map(each => parseInt(each));
            let existingTagIds = await product.related('tags').pluck('id');
            // get an array that contains the ids of the existings tags

            //remove all the current tags that are not selected anymore
            let toRemove = existingTagIds.filter(id => tagIds.includes(id) === false)

            await product.tags().detach(toRemove)
            // add in all the tags from the form that are not in the product
            await product.tags().attach(tagIds);

            // shortcut
            // await products.tags.detach(existingTagIds);
            // await products.tags.attach(tagIds)

            res.redirect('/products')
        },
        error: async function (form) {
            res.render('products/update', {
                product: product.toJSON(),
                form: form.toHTML(bootstrapField)
            })
        },
        empty: async function (form) {
            res.render('products/update', {
                product: product.toJSON(),
                form: form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/:product_id/delete', async function (req, res) {
    const product = await dataLayer.getProductByID(req.params.product_id)
    res.render('products/delete', {
        product: product.toJSON()
    })
})

router.post('/:product_id/delete', async function (req, res) {
    const product = await dataLayer.getProductByID(req.params.product_id)
    await product.destroy();
    res.redirect('/products')
})

module.exports = router;