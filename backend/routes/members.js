const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const Wallet = require('../models/Wallet');
const Product = require('../models/Product');

// Ajouter un membre avec produits et validation des entrées
router.post('/', async (req, res) => {
    try {
        let { firstName, name, email, phone, address, sponsorId, products } = req.body;

        if (!firstName || !name || !email) {
            return res.status(400).json({ error: "❌ Prénom, Nom et Email sont obligatoires." });
        }

        // Vérification et formatage des données
        sponsorId = sponsorId && sponsorId.trim() !== "" ? sponsorId : null;
        products = Array.isArray(products) ? products.filter(id => id.trim() !== "") : [];

        const newMember = new Member({
            firstName,
            name,
            email,
            phone,
            address,
            sponsorId,
            products
        });

        await newMember.save();
        console.log("✅ Membre ajouté :", newMember);
        res.status(201).json(newMember);
    } catch (err) {
        console.error("❌ Erreur lors de l'ajout d'un membre :", err);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});

// Modifier un membre (avec produits et validation)
router.put('/:id', async (req, res) => {
    try {
        let { firstName, name, email, phone, address, sponsorId, products } = req.body;

        if (!firstName || !name || !email) {
            return res.status(400).json({ error: "❌ Prénom, Nom et Email sont obligatoires." });
        }

        sponsorId = sponsorId && sponsorId.trim() !== "" ? sponsorId : null;
        products = Array.isArray(products) ? products.filter(id => id.trim() !== "") : [];

        const updatedMember = await Member.findByIdAndUpdate(
            req.params.id,
            { firstName, name, email, phone, address, sponsorId, products },
            { new: true, runValidators: true }
        ).populate('products');

        if (!updatedMember) {
            return res.status(404).json({ error: "❌ Membre non trouvé." });
        }

        console.log("✅ Membre modifié :", updatedMember);
        res.json(updatedMember);
    } catch (err) {
        console.error("❌ Erreur lors de la modification d'un membre :", err);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});

// Obtenir tous les membres (et leurs produits et wallets associés)
router.get('/', async (req, res) => {
    try {
        const members = await Member.find()
            .populate('products')
            .populate('wallets');

        console.log("📡 Liste des membres récupérée :", members.length, "membres.");
        res.json(members);
    } catch (err) {
        console.error("❌ Erreur lors de la récupération des membres :", err);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});

// Supprimer un membre et ses wallets associés
router.delete('/:id', async (req, res) => {
    try {
        const member = await Member.findById(req.params.id);
        if (!member) {
            return res.status(404).json({ error: "❌ Membre non trouvé." });
        }

        // Supprimer les wallets associés au membre
        await Wallet.deleteMany({ ownerId: req.params.id });

        // Supprimer le membre
        await Member.findByIdAndDelete(req.params.id);

        console.log("🗑️ Membre supprimé :", req.params.id);
        res.json({ message: "✅ Membre et ses wallets associés supprimés avec succès." });
    } catch (err) {
        console.error("❌ Erreur lors de la suppression d'un membre :", err);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});

module.exports = router;