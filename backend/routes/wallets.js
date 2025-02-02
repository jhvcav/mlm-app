const express = require('express');
const router = express.Router();
const Wallet = require('../models/Wallet');
const bcrypt = require('bcrypt');

// Ajouter un wallet (avec chiffrement des données sensibles)
router.post('/', async (req, res) => {
    try {
        const { memberId, walletName, address, password, secretPhrase } = req.body;

        // Chiffrer le mot de passe et la phrase secrète
        const encryptedPassword = await bcrypt.hash(password, 10);
        const encryptedSecretPhrase = await bcrypt.hash(secretPhrase, 10);

        const newWallet = new Wallet({ memberId, walletName, address, encryptedPassword, encryptedSecretPhrase });
        await newWallet.save();
        res.status(201).json({ message: 'Wallet ajouté' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Obtenir tous les wallets (sans afficher les données chiffrées)
router.get('/', async (req, res) => {
    try {
        const wallets = await Wallet.find().populate('memberId').select('-encryptedPassword -encryptedSecretPhrase');
        res.json(wallets);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Supprimer un wallet
router.delete('/:id', async (req, res) => {
    try {
        await Wallet.findByIdAndDelete(req.params.id);
        res.json({ message: 'Wallet supprimé' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;