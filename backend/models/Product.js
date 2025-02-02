const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },  // Nom du produit
    price: { type: Number, required: true }, // Prix en USD ou autre monnaie
    duration: { type: String },              // Durée (ex : "6 mois", "1 an")
    commission: { type: Number },            // Commission accordée
    level: { type: String },                 // Niveau MLM (ex: Bronze, Silver, Gold)
    createdAt: { type: Date, default: Date.now } // Date de création
});

module.exports = mongoose.model('Product', ProductSchema);