const express = require('express');
const bcrypt = require('bcryptjs');
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

        const hashedPassword = await bcrypt.hash(password, 10);

        const newMember = new Member({
            firstName,
            lastName,
            email,
            phone,
            password: hashedPassword
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

        const isMatch = await bcrypt.compare(password, member.password);
        if (!isMatch) {
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

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            console.error("❌ Mot de passe incorrect !");
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

// ✅ Accès au tableau de bord admin
router.get('/admin/dashboard', verifyToken, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: "⛔ Accès refusé." });

    res.json({ message: "🎉 Bienvenue sur le tableau de bord admin." });
});

// ✅ Liste des membres (uniquement pour admin)
router.get('/admin/members', verifyToken, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: "⛔ Accès refusé." });

    try {
        const members = await Member.find().select('-password');
        res.json(members);
    } catch (err) {
        console.error("Erreur lors de la récupération des membres :", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// ✅ Suppression d’un membre (admin seulement)
router.delete('/admin/member/:id', verifyToken, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: "⛔ Accès refusé." });

    try {
        await Member.findByIdAndDelete(req.params.id);
        res.json({ message: "✅ Membre supprimé avec succès." });
    } catch (err) {
        console.error("Erreur suppression membre :", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// ✅ Inscription d'un nouvel administrateur
router.post('/register/admin', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) return res.status(400).json({ error: "Cet email est déjà utilisé !" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = new Admin({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role: "admin"
            
        });

        await newAdmin.save();
        res.status(201).json({ message: "✅ Administrateur créé avec succès !" });
    } catch (err) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// ✅ Test de la route /api/auth
router.get('/', (req, res) => {
    res.json({ message: "🔒 API Auth fonctionne ! Routes disponibles : /register/member, /login/member, /register/admin, /login/admin" });
});

router.get('/members', async (req, res) => {
    try {
        const members = await Member.find().select('-password'); // Exclure le mot de passe
        res.json(members);
    } catch (err) {
        console.error("Erreur récupération des membres :", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

router.get('/admins', async (req, res) => {
    try {
        const admins = await Admin.find().select('-password'); // Exclure le mot de passe hashé
        res.json(admins);
    } catch (err) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});

module.exports = router;