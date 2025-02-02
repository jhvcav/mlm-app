const express = require('express');
const router = express.Router();
const Wallet = require('../models/Wallet');

// Ajouter un wallet
router.post('/', async (req, res) => {
    try {
        const newWallet = new Wallet(req.body);
        await newWallet.save();
        res.status(201).json(newWallet);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Obtenir tous les wallets
router.get('/', async (req, res) => {
    try {
        const wallets = await Wallet.find().populate('ownerId');
        res.json(wallets);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;