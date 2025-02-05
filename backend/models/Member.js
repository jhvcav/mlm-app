const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
    firstName: { type: String, required: false },
    name: { type: String, required: false },
    email: { type: String, required: false, unique: false },
    phone: { type: String, required: false },
    password: { type: String, required: false },
    address: { type: String },
    sponsorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' }, // Référence vers le sponsor
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], // Produits souscrits
    wallets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Wallet' }], // Wallets associés
    photo: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Member', MemberSchema);