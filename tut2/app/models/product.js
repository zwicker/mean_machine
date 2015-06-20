// grab the required packages
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//product schema
var ProductSchema = new Schema({
	name: String
});

module.exports = mongoose.model('Product', ProductSchema);