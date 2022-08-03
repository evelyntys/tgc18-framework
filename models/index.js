const bookshelf = require('../bookshelf');
//by default if we require/import a folder, nodejs will look for index.js

//a bookshelf model represents one table
//the name of the model(first arg) must be the singular form of the table name
//and the first letter must be uppercase
const Product = bookshelf.model('Product', {
    tableName: 'products', //must match table name in your database
    // the name of the function is the name of the relationship
    // the name of relationship function must match the model name but singular and always lower case
    // singular because only can belong to one 
    category: function(){
        return this.belongsTo('Category');
    },
    tags: function(){
        return this.belongsToMany('Tag')
    }
})

// first argument in the model to be uppercase & singular form of the table name
const Category = bookshelf.model('Category', {
    tableName: 'categories',
    // plural because one category can have many products
    // name of function for a HasMany relationship should be the plural form of the corresponding model in plural form
    // and all lower case
    products: function(){
        return this.hasMany('Product')
    }
})

const Tag = bookshelf.model('Tag', {
    tableName: 'tags',
    products: function(){
        return this.hasMany('Product')
    }

})

// first arg is name of the model
// it should be the table name in lowercase form and singular
const User = bookshelf.model('User', {
    tableName: 'users',

})

const CartItem = bookshelf.model('CartItem', {
    tableName: 'cart_items',
    product(){
        return this.belongsTo('Product'); //arg refers to a model mae
    },
    user(){
        return this.belongsTo('User');
    }
})

const BlacklistedToken = bookshelf.model('BlacklistedToken', {
    tableName: 'blacklisted_tokens'
})

module.exports = { Product, Category, Tag, User, CartItem, BlacklistedToken };
