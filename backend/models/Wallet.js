const mongoose = require('mongoose');

const WalletSchema = new mongoose.Schema({
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
    walletName: { type: String, required: true },
    publicAddress: { type: String, required: true },
    encryptedPassword: { type: String, required: true },
    secretPhrase: { type: String }
});

module.exports = mongoose.model('Wallet', WalletSchema);