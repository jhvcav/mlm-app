const mongoose = require('mongoose');

const WalletSchema = new mongoose.Schema({
    memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true }, // Référence au membre
    walletName: { type: String, required: true },  // Nom du wallet (ex: Metamask, Trust Wallet)
    address: { type: String, required: true },     // Adresse publique du wallet
    encryptedPassword: { type: String, required: true }, // Mot de passe chiffré du wallet
    encryptedSecretPhrase: { type: String, required: true }, // Phrase secrète chiffrée (12 mots)
    createdAt: { type: Date, default: Date.now } // Date d'enregistrement
});

module.exports = mongoose.model('Wallet', WalletSchema);