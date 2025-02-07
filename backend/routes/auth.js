const express = require('express');
const jwt = require('jsonwebtoken');
const Member = require('../models/Member');
const Admin = require('../models/Admin');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// ✅ Fonction pour générer un token JWT
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '7d' });
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

/* ================================
📌 ROUTE ADMIN : Accéder au tableau de bord
================================ */
router.get('/admin/dashboard', verifyToken, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: "⛔ Accès refusé." });
    }
    res.json({ message: "🎉 Bienvenue sur le tableau de bord admin." });
});

/* ================================
📌 Récupérer la liste des admins
================================ */
router.get('/admins', async (req, res) => {
    try {
        const admins = await Admin.find().select('-password');
        res.json(admins);
    } catch (err) {
        res.status(500).json({ error: "❌ Erreur serveur" });
    }
});

router.post('/register/admin', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ error: "❌ Tous les champs sont obligatoires." });
    }

    try {
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ error: "❌ Cet email est déjà utilisé !" });
        }

        const newAdmin = new Admin({
            firstName,
            lastName,
            email,
            password,  // ✅ Stocké en clair temporairement
            role: "admin"
        });

        await newAdmin.save();
        res.status(201).json({ message: "✅ Administrateur créé avec succès !" });

    } catch (err) {
        console.error("🚨 Erreur lors de l'inscription de l'admin :", err);
        res.status(500).json({ error: "❌ Erreur serveur" });
    }
});

router.post('/login/admin', async (req, res) => {
    console.log("📩 Tentative de connexion admin :", req.body);
    
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Email et mot de passe sont requis." });
    }

    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            console.error("❌ Administrateur introuvable !");
            return res.status(401).json({ error: "Administrateur introuvable." });
        }

        console.log("🔑 Mot de passe fourni :", password);
        console.log("🔒 Mot de passe en base :", admin.password);

        if (password !== admin.password) {
            return res.status(401).json({ error: "Mot de passe incorrect." });
        }

        const token = generateToken(admin._id, 'admin');
        console.log("✅ Connexion réussie, token généré :", token);

        res.json({ token, user: { id: admin._id, email: admin.email, role: 'admin' } });
    } catch (err) {
        console.error("🚨 Erreur serveur :", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

module.exports = router;