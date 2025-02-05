const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const WalletSchema = new mongoose.Schema({
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
    walletName: { type: String, required: true },
    publicAddress: { type: String, required: true },
    encryptedPassword: { type: String, required: true },
    secretPhrase: { type: String, required: true }
});

// Avant d'enregistrer, on crypte le mot de passe et les 12 mots secrets
WalletSchema.pre('save', async function (next) {
    try {
        if (this.isModified('encryptedPassword')) {
            const salt = await bcrypt.genSalt(10);
            this.encryptedPassword = await bcrypt.hash(this.encryptedPassword, salt);
        }

        if (this.isModified('secretPhrase')) {
            const salt = await bcrypt.genSalt(10);
            this.secretPhrase = await bcrypt.hash(this.secretPhrase, salt);
        }

        next();
    } catch (err) {
        next(err);
    }
});

// 📌 Vérifier le mot de passe avec `bcrypt.compare`
WalletSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.encryptedPassword);
};

// 📌 Vérifier les 12 mots secrets avec `bcrypt.compare`
WalletSchema.methods.compareSecretPhrase = async function (phrase) {
    return await bcrypt.compare(phrase, this.secretPhrase);
};

module.exports = mongoose.model('Wallet', WalletSchema);