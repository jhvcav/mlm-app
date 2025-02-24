const mongoose = require('mongoose');

const WalletSchema = new mongoose.Schema({
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
    walletName: { type: String, required: true },
    publicAddress: { type: String, required: true },
    encryptedPassword: { type: String, required: false }, // Stocké en clair ⚠️
    secretPhrase: { type: String, required: false } // Stocké en clair ⚠️
});

module.exports = mongoose.model('Wallet', WalletSchema);