const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
    firstName: { type: String, required: false }, // Optionnel
    name: { type: String, required: false }, // Optionnel
    email: { type: String, required: true, unique: true }, // ✅ Obligatoire et unique
    phone: { type: String, required: true }, // ✅ Obligatoire
    password: { type: String, required: true }, // ✅ Stocké en clair
    address: { type: String },
    sponsorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' }, // Référence vers le sponsor
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], // Produits souscrits
    wallets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Wallet' }], // Wallets associés
    photo: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Member', MemberSchema);