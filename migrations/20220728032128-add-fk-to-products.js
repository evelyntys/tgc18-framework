'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

// delete all existing products before adding a foreign key 

exports.up = function(db) {
  // first argument: the table that you want to change i.e. add a new column to
  // second argument: the name of the new column
  // the name of the foreign key should be that of the other table in singular form with _id at the back
  // third argument: the object that defines the column
  // when create foreign key, must ensure that it matches the data type of the corresponding primary key
  return db.addColumn('products', 'category_id', {
    type: 'int', 
    unsigned: true,
    notNull: true,
    foreignKey: {
      name: 'product_category_fk',
      table: 'categories',
      mapping: 'id', //maps to id in categories table
      rules: {
        onDelete: 'cascade', //enables cascading delete || if put onDelete: 'restrict', cannot delete if it exists in other tables
        // cascading delete means if u delete a category, all the products associated with that cateogory will be deleted as well
        // to ensure integrity in the database
        // cascading delete only good for simple relationships and small applications
        // cascading delete still quite safe for many to many -> will only delete its own relationship e.g. delete one category from 
        // product with many categories
        onUpdate: 'restrict'
      },
    }
  });
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
