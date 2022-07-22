const bookshelf = require('../bookshelf');
//by default if we require/import a folder, nodejs will look for index.js

//a bookshelf model represents one table
//the name of the model(first arg) must be the singular form of the table name
//and the first letter must be uppercase
const Product = bookshelf.model('Product', {
    tableName: 'products' //must match table name in your database
})

module.exports = { Product };
