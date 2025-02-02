const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
    memberId: { type: String, unique: true, required: true }, // ID unique
    name: String,
    email: String,
    phone: String,
    address: String,
    sponsorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' }, // Parrain
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }] // Produits souscrits
});

module.exports = mongoose.model('Member', MemberSchema);