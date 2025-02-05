const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const Wallet = require('../models/Wallet');
const Product = require('../models/Product');

// Fonction pour générer un ID membre unique
const generateMemberId = async () => {
    const randomNumber = Math.floor(10000 + Math.random() * 90000); // Génère un numéro aléatoire 5 chiffres
    const memberId = `RMR-${randomNumber}`;

    // Vérifie si l'ID existe déjà dans la base
    const existingMember = await Member.findOne({ memberId });
    if (existingMember) {
        return generateMemberId(); // Regénère si l'ID existe déjà
    }
    return memberId;
};

// ✅ Ajouter un membre avec génération d'un ID unique et nouvelles données
router.post('/', async (req, res) => {
    try {
        let { firstName, name, email, phone, address, city, country, registrationDate, sponsorId, products } = req.body;

        if (!firstName || !name || !email) {
            return res.status(400).json({ error: "❌ Prénom, Nom et Email sont obligatoires." });
        }

        // Vérification et formatage des données
        sponsorId = sponsorId && sponsorId.trim() !== "" ? sponsorId : null;
        products = Array.isArray(products) ? products.filter(id => id.trim() !== "") : [];
        
        // Générer un ID unique pour le membre
        const memberId = await generateMemberId();

        const newMember = new Member({
            memberId, // Ajout de l'ID membre
            firstName,
            name,
            email,
            phone,
            address,
            city,
            country,
            registrationDate: registrationDate || new Date().toISOString().split('T')[0], // Par défaut, date du jour
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

// ✅ Modifier un membre (y compris les nouvelles données)
router.put('/:id', async (req, res) => {
    try {
        const { sponsorId, products, ...otherData } = req.body;

        // Convertir sponsorId à null si vide
        const updatedData = {
            ...otherData,
            sponsorId: sponsorId && sponsorId.trim() !== "" ? sponsorId : null,
            products: Array.isArray(products) ? products.filter(p => p) : []
        };

        const updatedMember = await Member.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        if (!updatedMember) {
            return res.status(404).json({ error: "Membre non trouvé." });
        }
        res.json(updatedMember);
    } catch (err) {
        console.error("❌ Erreur dans PUT /api/members/:id :", err);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});

// ✅ Obtenir tous les membres (et leurs produits et wallets associés)
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

// ✅ Supprimer un membre et ses wallets associés
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

// ✅ Récupérer l'arbre du réseau d'un membre
router.get('/network/:memberId', async (req, res) => {
    try {
        const getNetworkTree = async (memberId) => {
            const member = await Member.findById(memberId).select("firstName name").lean();
            if (!member) return null;

            const children = await Member.find({ sponsorId: memberId }).select("firstName name").lean();
            member.children = await Promise.all(children.map(child => getNetworkTree(child._id)));
            return member;
        };

        const networkTree = await getNetworkTree(req.params.memberId);
        if (!networkTree) {
            return res.status(404).json({ error: "❌ Membre introuvable." });
        }

        res.json(networkTree);
    } catch (err) {
        console.error("❌ Erreur récupération réseau :", err);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});

module.exports = router;