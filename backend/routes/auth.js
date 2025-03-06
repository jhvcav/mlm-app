const express = require('express');
const jwt = require('jsonwebtoken');
const Member = require('../models/Member');
const nodemailer = require('nodemailer');
const router = express.Router();
const bcrypt = require("bcrypt");

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// ✅ Middleware de vérification du token
const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) {
        return res.status(403).json({ error: "⛔ Accès refusé. Token manquant." });
    }

    try {
        const decoded = jwt.verify(token.split(" ")[1], JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: "⛔ Token invalide." });
    }
};

// ✅ Middleware pour vérifier si un utilisateur est Super Admin
const verifySuperAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "superadmin") {
        return res.status(403).json({ error: "⛔ Accès refusé. Vous devez être Super Admin." });
    }
    next();
};

// ✅ Générer un token JWT
const generateToken = (id, role, permissions) => {
    return jwt.sign({ id, role, permissions }, JWT_SECRET, { expiresIn: '7d' });
};

// ✅ Route pour inscrire un utilisateur (TEST)
router.post('/register', async (req, res) => {
    const { firstName, lastName, email, password, role } = req.body;

    if (!firstName || !lastName || !email || !password || !role) {
        return res.status(400).json({ error: "❌ Tous les champs sont obligatoires." });
    }

    try {
        const existingUser = await Member.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "❌ Cet email est déjà utilisé !" });
        }

        const newUser = new Member({
            firstName,
            lastName,
            email,
            password,  // Stocké en clair (pas sécurisé, mais pour test)
            role,
            permissions: {}
        });

        await newUser.save();
        res.status(201).json({ message: "✅ Utilisateur créé avec succès !" });

    } catch (err) {
        console.error("🚨 Erreur lors de l'inscription :", err);
        res.status(500).json({ error: "❌ Erreur serveur" });
    }
});

// ✅ Connexion et génération de token
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Member.findOne({ email }).select("+password");

        if (!email || !password) {
            return res.status(400).json({ error: "❌ Email et mot de passe sont requis." });
        }
        // ✅ Vérification si le champ `activityLog` existe
        if (!user.activityLog) user.activityLog = [];

        if (!user) {
            console.log("❌ Utilisateur introuvable:", email);
            return res.status(401).json({ error: "Utilisateur introuvable." });
        }
        // Ajouter un log d'activité
        const newActivity = `${new Date().toLocaleString()}-Connexion réussi`;
        user.activityLog.push(newActivity);
        await user.save();

        console.log("✅ Activité ajoutée :", newActivity);

        console.log("🔍 Vérification du mot de passe...");
        console.log("Mot de passe en base:", user.password);

        if (password !== user.password) {
            console.log("❌ Mot de passe incorrect.");
            return res.status(401).json({ error: "Mot de passe incorrect." });
        }

        console.log("✅ Connexion réussie !");
        const token = generateToken(user._id, user.role, user.permissions);
        res.json({ token, user });

    } catch (err) {
        console.error("🚨 Erreur serveur :", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// ✅ Route pour accéder au tableau de bord du Super Admin
router.get('/superadmin/dashboard', verifyToken, verifySuperAdmin, (req, res) => {
    res.json({ message: "🎉 Bienvenue sur le tableau de bord du Super Admin !" });
});

// ✅ Route pour changer le mot de passe après vérification du token
router.post('/new-password', async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return res.status(400).json({ error: "❌ Token et nouveau mot de passe requis." });
    }

    try {
        // 🔹 Vérification du token JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await Member.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ error: "❌ Utilisateur non trouvé." });
        }

        // 🔹 Hachage du nouveau mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // 🔹 Mise à jour du mot de passe
        user.password = hashedPassword;
        await user.save();

        res.json({ message: "✅ Mot de passe mis à jour avec succès !" });

    } catch (err) {
        console.error("🚨 Erreur lors de la réinitialisation du mot de passe :", err);
        res.status(500).json({ error: "❌ Erreur serveur" });
    }
});

// ✅ Route pour récupérer tous les administrateurs (admin + superadmin)
router.get('/admins', verifyToken, async (req, res) => {
    try {
        const admins = await Member.find({ role: { $in: ["admin", "superadmin"] } });
        res.json(admins);
    } catch (err) {
        console.error("🚨 Erreur récupération admins :", err);
        res.status(500).json({ error: "❌ Erreur serveur" });
    }
});

router.get('/admins', async (req, res) => {
    try {
        const admins = await Member.find({ role: "admin" });
        res.json(admins);
    } catch (error) {
        console.error("Erreur récupération des admins :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// ✅ Route pour récupérer un admin par son ID
router.get('/admin/:id', verifyToken, async (req, res) => {
    try {
        const members = await Member.findById(req.params.id);
        if (!members) {
            return res.status(404).json({ error: "❌ Admin non trouvé." });
        }
        res.json(members);
    } catch (error) {
        console.error("❌ Erreur serveur :", error);
        res.status(500).json({ error: "❌ Erreur serveur." });
    }
});

// ✅ Supprimer un admin
router.delete('/admins/:email', async (req, res) => {
    const { email } = req.params;

    try {
        const deletedAdmin = await Member.findOneAndDelete({ email, role: "admin" });
        if (!deletedAdmin) {
            return res.status(404).json({ error: "❌ Administrateur non trouvé." });
        }

        res.json({ message: "✅ Administrateur supprimé avec succès." });
    } catch (err) {
        console.error("🚨 Erreur suppression admin :", err);
        res.status(500).json({ error: "❌ Erreur serveur." });
    }
});

// ✅ Mettre à jour un Admin
router.put("/admin/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updatedAdmin = await Member.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedAdmin) {
            return res.status(404).json({ error: "❌ Admin non trouvé." });
        }

        res.json({ message: "✅ Admin mis à jour avec succès", admin: updatedAdmin });
    } catch (error) {
        console.error("❌ Erreur mise à jour de l'Admin :", error);
        res.status(500).json({ error: "❌ Erreur serveur lors de la mise à jour." });
    }
});

// ✅ Supprimer un membre
router.delete('/members/:email', async (req, res) => {
    const { email } = req.params;

    try {
        const deletedMember = await Member.findOneAndDelete({ email });

        if (!deletedMember) {
            return res.status(404).json({ error: "❌ Membre non trouvé." });
        }

        res.json({ message: "✅ Membre supprimé avec succès." });
    } catch (error) {
        console.error("❌ Erreur lors de la suppression :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// ✅ Route pour récupérer un membre par son ID
router.get('/members/:id', verifyToken, async (req, res) => {
    try {
        const member = await Member.findById(req.params.id);
        if (!member) {
            return res.status(404).json({ error: "❌ Membre non trouvé." });
        }
        res.json(member);
    } catch (error) {
        console.error("❌ Erreur récupération utilisateur :", error);
        res.status(500).json({ error: "❌ Erreur serveur." });
    }
});

router.get('/', (req, res) => {
    res.json({ message: "API Auth en ligne !" });
});

module.exports = router;
