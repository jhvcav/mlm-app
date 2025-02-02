const express = require('express');
const router = express.Router();
const Wallet = require('../models/Wallet');
const Member = require('../models/Member');

// Ajouter un wallet à un membre
router.post('/add-wallet', async (req, res) => {
    try {
        const { memberId, walletName, publicAddress, encryptedPassword, secretPhrase } = req.body;

        const member = await Member.findById(memberId);
        if (!member) {
            return res.status(404).json({ error: "Membre introuvable" });
        }

        // Créer un nouveau wallet associé au membre sélectionné
        const newWallet = new Wallet({
            ownerId: member._id,
            walletName,
            publicAddress,
            encryptedPassword,
            secretPhrase
        });

        await newWallet.save();

        // Ajouter le wallet à la liste des wallets du membre
        member.wallets.push(newWallet._id);
        await member.save();

        res.json({ message: "Wallet ajouté avec succès !", wallet: newWallet });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Récupérer tous les wallets avec les membres associés
router.get('/', async (req, res) => {
    try {
        const wallets = await Wallet.find().populate('ownerId', 'firstName name email');
        res.json(wallets);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;