const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: String,
    price: Number,
    duration: String,
    commission: Number,
    level: String
});

module.exports = mongoose.model('Product', ProductSchema);