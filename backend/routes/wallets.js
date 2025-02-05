const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const Wallet = require('../models/Wallet');
const Member = require('../models/Member');

// ✅ Ajouter un wallet à un membre avec cryptage sécurisé
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

        // Générer un sel pour le hashage
        const salt = await bcrypt.genSalt(12); // Augmenter la sécurité du hashage

        // Crypter le mot de passe et la phrase secrète séparément
        const hashedPassword = await bcrypt.hash(encryptedPassword, salt);
        const hashedSecretPhrase = await bcrypt.hash(secretPhrase, salt);

        // Créer le wallet avec les données cryptées
        const newWallet = new Wallet({
            ownerId: member._id,
            walletName: walletName.trim(),
            publicAddress: publicAddress.trim(),
            encryptedPassword: hashedPassword,
            secretPhrase: hashedSecretPhrase
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

// ✅ Vérifier un mot de passe chiffré
router.post('/verify-password', async (req, res) => {
    try {
        const { walletId, passwordToCheck } = req.body;

        // Vérifier si les champs sont bien fournis
        if (!walletId || !passwordToCheck) {
            return res.status(400).json({ error: "❌ Wallet ID et mot de passe requis." });
        }

        const wallet = await Wallet.findById(walletId);
        if (!wallet) {
            return res.status(404).json({ error: "⚠️ Wallet non trouvé." });
        }

        // Comparer le mot de passe saisi avec le hash en base
        const isMatch = await bcrypt.compare(passwordToCheck, wallet.encryptedPassword);
        if (!isMatch) {
            return res.status(401).json({ error: "❌ Mot de passe incorrect." });
        }

        res.json({ message: "✅ Mot de passe valide !" });
    } catch (err) {
        console.error("❌ Erreur lors de la vérification du mot de passe :", err);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});

// ✅ Vérifier une phrase secrète chiffrée (optionnel)
router.post('/verify-secret', async (req, res) => {
    try {
        const { walletId, secretToCheck } = req.body;

        // Vérifier si les champs sont bien fournis
        if (!walletId || !secretToCheck) {
            return res.status(400).json({ error: "❌ Wallet ID et phrase secrète requis." });
        }

        const wallet = await Wallet.findById(walletId);
        if (!wallet) {
            return res.status(404).json({ error: "⚠️ Wallet non trouvé." });
        }

        // Comparer la phrase secrète saisie avec le hash en base
        const isMatch = await bcrypt.compare(secretToCheck, wallet.secretPhrase);
        if (!isMatch) {
            return res.status(401).json({ error: "❌ Phrase secrète incorrecte." });
        }

        res.json({ message: "✅ Phrase secrète valide !" });
    } catch (err) {
        console.error("❌ Erreur lors de la vérification de la phrase secrète :", err);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});

// ✅ Récupérer les wallets d'un membre spécifique sans afficher le mot de passe ni la phrase secrète
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