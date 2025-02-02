const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String, required: true },
    commission: { type: Number, required: true },
    level: { type: String, required: true },
    membersSubscribed: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Member' }]
});

module.exports = mongoose.model('Product', ProductSchema);