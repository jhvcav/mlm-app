const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
    memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true }, // Référence au membre
    referrals: { type: Number, default: 0 },  // Nombre de personnes recrutées
    earnings: { type: Number, default: 0 },   // Total des gains générés
    level: { type: String, default: 'Beginner' }, // Niveau atteint (Beginner, Expert, etc.)
    createdAt: { type: Date, default: Date.now } // Date d'enregistrement
});

module.exports = mongoose.model('Progress', ProgressSchema);