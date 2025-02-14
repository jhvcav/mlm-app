const express = require('express');
const jwt = require('jsonwebtoken');
const Member = require('../models/Member');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// ✅ Générer un token JWT
const generateToken = (id, role, permissions) => {
    return jwt.sign({ id, role, permissions }, JWT_SECRET, { expiresIn: '7d' });
};

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

// ✅ Middleware pour vérifier si un utilisateur est Membre ou Admin
const verifyMember = (req, res, next) => {
    if (!req.user || !["member", "admin", "superadmin"].includes(req.user.role)) {
        return res.status(403).json({ error: "⛔ Accès refusé. Vous devez être un membre." });
    }
    next();
};

// ✅ Enregistrement d'un membre par le Super Admin
router.post('/register/member', verifyToken, verifySuperAdmin, async (req, res) => {
    const { firstName, lastName, email, phone, password, role, permissions } = req.body;

    if (!firstName || !lastName || !email || !password || !role) {
        return res.status(400).json({ error: "❌ Tous les champs sont obligatoires." });
    }

    try {
        const existingUser = await Member.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "❌ Cet email est déjà utilisé !" });
        }

        const newMember = new Member({
            firstName,
            lastName,
            email,
            phone,
            password,
            role,
            permissions: permissions || {} 
        });

        await newMember.save();
        res.status(201).json({ message: "✅ Membre créé avec succès !" });

    } catch (err) {
        console.error("🚨 Erreur lors de l'inscription du membre :", err);
        res.status(500).json({ error: "❌ Erreur serveur" });
    }
});

// ✅ Fonction pour enregistrer une action dans l'historique du membre
const logActivity = async (userId, action) => {
    await Member.findByIdAndUpdate(userId, { $push: { activityLog: `${new Date().toLocaleString()} - ${action}` } });
};

// ✅ Modifier la route de connexion pour enregistrer les connexions
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email et mot de passe sont requis." });
    }

    try {
        const user = await Member.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Utilisateur introuvable." });
        }

        if (password !== user.password) {
            return res.status(401).json({ error: "Mot de passe incorrect." });
        }

        const token = generateToken(user._id, user.role, user.permissions);
        
        // 🔹 Enregistrer la connexion dans l'historique
        await logActivity(user._id, "Connexion au compte");

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

// ✅ Route pour accéder au tableau de bord du Membre
router.get('/member/dashboard', verifyToken, verifyMember, async (req, res) => {
    try {
        const member = await Member.findById(req.user.id).select("-password"); // ❌ Exclure le mot de passe
        if (!member) {
            return res.status(404).json({ error: "❌ Membre introuvable." });
        }
        res.json({ message: "👤 Bienvenue sur le tableau de bord du Membre !", member });
    } catch (err) {
        console.error("🚨 Erreur lors de la récupération du membre :", err);
        res.status(500).json({ error: "❌ Erreur serveur" });
    }
});

module.exports = router;