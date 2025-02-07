const express = require('express');
const router = express.Router();
const Wallet = require('../models/Wallet');
const Member = require('../models/Member');

// ✅ Ajouter un wallet à un membre (sans cryptage)
router.post('/add-wallet', async (req, res) => {
    try {
        let { memberId, walletName, publicAddress, encryptedPassword, secretPhrase } = req.body;

        // 🔍 Vérifier si tous les champs obligatoires sont fournis
        if (!memberId || !walletName || !publicAddress || !encryptedPassword || !secretPhrase) {
            return res.status(400).json({ error: "❌ Tous les champs sont obligatoires." });
        }

        // Vérifier si le membre existe
        const member = await Member.findById(memberId);
        if (!member) {
            return res.status(404).json({ error: "❌ Membre introuvable." });
        }

        // Créer le wallet avec les données en clair
        const newWallet = new Wallet({
            ownerId: member._id,
            walletName: walletName.trim(),
            publicAddress: publicAddress.trim(),
            encryptedPassword,  // Stocke le mot de passe en clair
            secretPhrase        // Stocke la phrase secrète en clair
        });

        await newWallet.save();

        // Ajouter le wallet à la liste des wallets du membre
        member.wallets.push(newWallet._id);
        await member.save();

        res.status(201).json({ message: "✅ Wallet ajouté avec succès !" });
    } catch (err) {
        console.error("❌ Erreur lors de l'ajout du wallet :", err);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});

// ✅ Vérifier un mot de passe sans cryptage
router.post('/verify-password', async (req, res) => {
    try {
        const { walletId, passwordToCheck } = req.body;

        if (!walletId || !passwordToCheck) {
            return res.status(400).json({ error: "❌ Wallet ID et mot de passe requis." });
        }

        const wallet = await Wallet.findById(walletId);
        if (!wallet) {
            return res.status(404).json({ error: "⚠️ Wallet non trouvé." });
        }

        // Comparer directement avec la valeur stockée
        if (passwordToCheck !== wallet.encryptedPassword) {
            return res.status(401).json({ error: "❌ Mot de passe incorrect." });
        }

        res.json({ message: "✅ Mot de passe valide !" });
    } catch (err) {
        console.error("❌ Erreur lors de la vérification du mot de passe :", err);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});

// ✅ Vérifier une phrase secrète sans cryptage
router.post('/verify-secret', async (req, res) => {
    try {
        const { walletId, secretToCheck } = req.body;

        if (!walletId || !secretToCheck) {
            return res.status(400).json({ error: "❌ Wallet ID et phrase secrète requis." });
        }

        const wallet = await Wallet.findById(walletId);
        if (!wallet) {
            return res.status(404).json({ error: "⚠️ Wallet non trouvé." });
        }

        // Comparer directement avec la valeur stockée
        if (secretToCheck !== wallet.secretPhrase) {
            return res.status(401).json({ error: "❌ Phrase secrète incorrecte." });
        }

        res.json({ message: "✅ Phrase secrète valide !" });
    } catch (err) {
        console.error("❌ Erreur lors de la vérification de la phrase secrète :", err);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});

// ✅ Récupérer les wallets d'un membre (sans afficher le mot de passe ni la phrase secrète)
router.get('/member/:memberId', async (req, res) => {
    try {
        const memberId = req.params.memberId;

        // Vérifier si le membre existe
        const member = await Member.findById(memberId);
        if (!member) {
            return res.status(404).json({ error: "❌ Membre introuvable." });
        }

        // Récupérer les wallets du membre, en **excluant** encryptedPassword et secretPhrase
        const wallets = await Wallet.find({ ownerId: memberId }).select('-encryptedPassword -secretPhrase');

        if (wallets.length === 0) {
            return res.status(404).json({ error: "⚠️ Aucun wallet trouvé pour ce membre." });
        }

        res.json(wallets);
    } catch (err) {
        console.error("❌ Erreur lors de la récupération des wallets :", err);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});

module.exports = router;