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

exports.up = function(db) {
  return db.addColumn('products', 'brand_id', {
    type: 'int',
    unsigned: true,
    notNull: true,
    // when you delete a brand, all existing products under that brand will then be tagged to the default brand
    defaultValue: 1, //for all rows that do not have a brand id, default is 1
    foreignKey:{
      name: 'product_brand_fk',
      table: 'brands',
      mapping: 'id',
      rules: {
        onDelete: 'restrict',
        // when you change the primary key of a role; more for natural primary key (but rarely seen in industry)
        onUpdate: 'restrict'
      }
    }
  });
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
