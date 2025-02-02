const mongoose = require('mongoose');

const WalletSchema = new mongoose.Schema({
    name: String,
    address: String,
    password: String,
    secretPhrase: String,
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' } // Lien avec un membre
});

module.exports = mongoose.model('Wallet', WalletSchema);