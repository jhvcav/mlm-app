const express = require('express');
const jwt = require('jsonwebtoken');
const Member = require('../models/Member');
const Admin = require('../models/Admin');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: "🚀 API Auth en ligne !" });
});

// ✅ Secret JWT (Utiliser un fichier .env pour la sécurité)
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// ✅ Fonction de génération du token JWT
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '7d' });
};

/* ================================
📌 INSCRIPTION D'UN MEMBRE
================================ */
router.post('/register/member', async (req, res) => {
    const { firstName, lastName, email, phone, password } = req.body;

    if (!firstName || !lastName || !email || !phone || !password) {
        return res.status(400).json({ error: "Tous les champs sont obligatoires." });
    }

    try {
        const memberExists = await Member.findOne({ email });
        if (memberExists) {
            return res.status(400).json({ error: "Cet email est déjà utilisé." });
        }

        const newMember = new Member({
            firstName,
            lastName,
            email,
            phone,
            password // ✅ Stocké en clair
        });

        await newMember.save();
        res.status(201).json({ message: "✅ Inscription réussie !" });
    } catch (err) {
        console.error("Erreur d'inscription :", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

/* ================================
📌 CONNEXION DES MEMBRES
================================ */
router.post('/login/member', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email et mot de passe sont requis." });
    }

    try {
        const member = await Member.findOne({ email });
        if (!member) {
            return res.status(401).json({ error: "Utilisateur introuvable." });
        }

        if (password !== member.password) {
            return res.status(401).json({ error: "Mot de passe incorrect." });
        }

        const token = generateToken(member._id, 'member');

        res.json({ token, user: { id: member._id, firstName: member.firstName, lastName: member.lastName, email: member.email, phone: member.phone, role: 'member' } });
    } catch (err) {
        console.error("Erreur de connexion :", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

/* ================================
📌 CONNEXION DES ADMINISTRATEURS
================================ */
router.post('/login/admin', async (req, res) => {
    const { email, password } = req.body;
    console.log("📩 Tentative de connexion admin :", { email });

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

/* ================================
📌 MIDDLEWARE : VÉRIFICATION DU TOKEN
================================ */
const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) return res.status(403).json({ error: "⛔ Accès refusé. Token manquant." });

    try {
        const decoded = jwt.verify(token.split(" ")[1], JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: "⛔ Token invalide." });
    }
};

/* ================================
📌 ROUTES PROTÉGÉES
================================ */

// ✅ Accès aux informations du membre connecté
router.get('/member/profile', verifyToken, async (req, res) => {
    if (req.user.role !== 'member') return res.status(403).json({ error: "⛔ Accès refusé." });

    try {
        const member = await Member.findById(req.user.id).select('-password');
        if (!member) return res.status(404).json({ error: "❌ Membre introuvable." });

        res.json(member);
    } catch (err) {
        console.error("Erreur lors de la récupération du profil :", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// ✅ Inscription d'un nouvel administrateur
router.post('/register/admin', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) return res.status(400).json({ error: "Cet email est déjà utilisé !" });

        const newAdmin = new Admin({
            firstName,
            lastName,
            email,
            password,  // ✅ Stocké en clair
            role: "admin"
        });

        await newAdmin.save();
        res.status(201).json({ message: "✅ Administrateur créé avec succès !" });
    } catch (err) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// ✅ Liste des administrateurs (test)
router.get('/admins', async (req, res) => {
    try {
        const admins = await Admin.find().select('-password'); // Exclure le mot de passe
        res.json(admins);
    } catch (err) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});

module.exports = router;