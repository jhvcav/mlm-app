const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const Wallet = require('../models/Wallet');
const Product = require('../models/Product');

// Routes de test
router.get('/test', (req, res) => {
    res.json({ message: "L'API fonctionne !"});
});

// ✅ Supprimer un administrateur par son email
router.delete('/auth/admins/email/:email', async (req, res) => {
    try {
        console.log("🔍 Recherche de l'admin avec l'email :", req.params.email);
        
        // Vérifier si l'admin existe
        const admin = await Member.findOne({ email: req.params.email, role: "admin" });

        if (!admin) {
            console.log("❌ AUCUN ADMIN TROUVÉ !");
            return res.status(404).json({ error: "❌ Administrateur non trouvé." });
        }

        console.log("✅ ADMIN TROUVÉ :", admin);

        // Supprimer l'admin
        const result = await Member.deleteOne({ email: req.params.email });

        console.log("🗑️ Résultat de la suppression :", result);

        if (result.deletedCount === 0) {
            console.log("❌ La suppression a échoué !");
            return res.status(500).json({ error: "Erreur lors de la suppression." });
        }

        console.log("✅ Administrateur supprimé :", req.params.email);
        res.json({ message: `✅ Administrateur ${req.params.email} supprimé avec succès.` });

    } catch (err) {
        console.error("❌ Erreur lors de la suppression :", err);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});

// ✅ Supprimer un administrateur par son ID
router.delete('/auth/admins/:id', async (req, res) => {
    try {
        const admin = await Member.findOne({ _id: req.params.id, role: "admin" });

        if (!admin) {
            return res.status(404).json({ error: "❌ Administrateur non trouvé." });
        }

        // Suppression de l'admin par ID
        await Member.findByIdAndDelete(req.params.id);

        console.log("🗑️ Administrateur supprimé :", req.params.id);
        res.json({ message: `✅ Administrateur avec l'ID ${req.params.id} supprimé avec succès.` });
    } catch (err) {
        console.error("❌ Erreur lors de la suppression de l'administrateur :", err);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});

// ✅ Supprimer un membre par son email
router.delete('/email/:email', async (req, res) => {
    try {
        const { email } = req.params;

        // Vérifier si le membre existe
        const member = await Member.findOne({ email });

        if (!member) {
            return res.status(404).json({ error: "❌ Membre non trouvé." });
        }

        // Supprimer les wallets associés
        await Wallet.deleteMany({ ownerId: member._id });

        // Supprimer le membre
        await Member.deleteOne({ email });

        console.log("🗑️ Membre supprimé :", email);
        res.json({ message: `✅ Membre avec l'email ${email} supprimé avec succès.` });
    } catch (err) {
        console.error("❌ Erreur lors de la suppression du membre :", err);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});

// ✅ Supprimer un administrateur par son ID
router.delete('/admins/:id', async (req, res) => {
    try {
        const admin = await Member.findById(req.params.id);

        if (!admin || admin.role !== "admin") {
            return res.status(404).json({ error: "❌ Administrateur non trouvé." });
        }

        // Supprimer l'administrateur
        await Member.findByIdAndDelete(req.params.id);

        console.log("🗑️ Administrateur supprimé :", req.params.id);
        res.json({ message: `✅ Administrateur supprimé avec succès.` });
    } catch (err) {
        console.error("❌ Erreur lors de la suppression de l'administrateur :", err);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});

// ✅ Supprimer un administrateur par son email
router.delete('/admins/email/:email', async (req, res) => {
    try {
        const { email } = req.params;

        // Vérifier si l'admin existe avec cet email
        const admin = await Member.findOne({ email, role: "admin" });

        if (!admin) {
            return res.status(404).json({ error: "❌ Administrateur non trouvé." });
        }

        // Supprimer l'administrateur par son _id au lieu de l'email (plus fiable)
        await Member.findByIdAndDelete(admin._id);

        console.log("🗑️ Administrateur supprimé :", email);
        res.json({ message: `✅ Administrateur ${email} supprimé avec succès.` });
    } catch (err) {
        console.error("❌ Erreur lors de la suppression de l'administrateur :", err);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});

// ✅ Supprimer un membre par son email
router.delete('/email/:email', async (req, res) => {
    try {
        const member = await Member.findOne({ email: req.params.email, role: "member" });

        if (!member) {
            return res.status(404).json({ error: "❌ Membre non trouvé." });
        }

        await Member.deleteOne({ email: req.params.email });

        console.log("🗑️ Membre supprimé :", req.params.email);
        res.json({ message: `✅ Membre ${req.params.email} supprimé avec succès.` });
    } catch (err) {
        console.error("❌ Erreur lors de la suppression du membre :", err);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});

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

router.post('/', async (req, res) => {
    try {
        let { firstName, name, email, phone, address, role, password } = req.body;

        if (!firstName || !name || !email || !password || !phone) {
            return res.status(400).json({ error: "❌ Prénom, Nom, Email, Téléphone et Mot de passe sont obligatoires." });
        }

        // Vérifie si l'email existe déjà
        const existingMember = await Member.findOne({ email });
        if (existingMember) {
            return res.status(400).json({ error: "❌ Un compte avec cet email existe déjà." });
        }

        // Assurez-vous que le rôle est bien défini (soit "admin", soit "member")
        if (role !== "admin") {
            role = "member"; // Si le rôle n'est pas "admin", on met "member" par défaut
        }

        // Création du nouvel utilisateur
        const newMember = new Member({
            firstName,
            name,
            email,
            phone,
            address,
            role,  // ✅ Maintenant, on prend en compte le rôle envoyé
            password // Stocké en clair comme demandé ⚠️
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

// ✅ Supprimer un membre et ses wallets associés en utilisant l'email
router.delete('/email/:email', async (req, res) => {
    try {
        const { email } = req.params;

        // Vérifier si le membre existe avec cet email
        const member = await Member.findOne({ email });

        if (!member) {
            return res.status(404).json({ error: "❌ Membre non trouvé." });
        }

        // Supprimer les wallets associés
        await Wallet.deleteMany({ ownerId: member._id });

        // Supprimer le membre en utilisant son email
        await Member.deleteOne({ email });

        console.log("🗑️ Membre supprimé :", email);
        res.json({ message: `✅ Membre avec l'email ${email} et ses wallets associés supprimés avec succès.` });
    } catch (err) {
        console.error("❌ Erreur lors de la suppression du membre :", err);
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

// ✅ Récupérer tous les admins
router.get('/admins', async (req, res) => {
    try {
        const admins = await Member.find({ role: "admin" });
        if (!admins.length) {
            return res.json([]);  // Retourne un tableau vide si aucun admin
        }
        res.json(admins);
    } catch (err) {
        console.error("❌ Erreur lors de la récupération des admins :", err);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});

// ✅ Récupère un membre par son email
router.get('/email/:email', async (req, res) => {
    try {
        const member = await Member.findOne({ email: req.params.email });

        if (!member) {
            return res.status(404).json({ error: "❌ Email Membre non trouvé." });
        }

        console.log("📡 Email récupéré :", member.email);
        res.json(member);
    } catch (err) {
        console.error("❌ Erreur lors de la récupération de l'email :", err);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});

// ✅ Récupérer un administrateur par son email
router.get('/auth/admins/email/:email', async (req, res) => {
    try {
        const admin = await Member.findOne({ email: req.params.email, role: "admin" });

        if (!admin) {
            return res.status(404).json({ error: "❌ Administrateur non trouvé." });
        }

        res.json(admin);
    } catch (err) {
        console.error("❌ Erreur lors de la récupération de l'administrateur :", err);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});

// ✅ Récupérer un administrateur spécifique par son email
router.get('/admins/email/:email', async (req, res) => {
    try {
        const admin = await Member.findOne({ email: req.params.email, role: "admin" });
        if (!admin) {
            return res.status(404).json({ error: "❌ Administrateur non trouvé." });
        }
        res.json(admin);
    } catch (err) {
        console.error("❌ Erreur lors de la récupération de l'administrateur :", err);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});

module.exports = router;