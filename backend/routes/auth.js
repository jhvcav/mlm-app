const express = require('express');
const jwt = require('jsonwebtoken');
const Member = require('../models/Member');
const Admin = require('../models/Admin');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '7d' });
};

/* ================================
📌 CONNEXION ADMINISTRATEUR
================================ */
router.post('/login/admin', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "❌ Email et mot de passe sont requis." });
    }

    try {
        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(401).json({ error: "❌ Administrateur introuvable." });
        }

        if (password !== admin.password) {
            return res.status(401).json({ error: "❌ Mot de passe incorrect." });
        }

        const token = generateToken(admin._id, "admin");
        res.json({ token, user: { id: admin._id, email: admin.email, role: "admin" } });

    } catch (err) {
        console.error("🚨 Erreur serveur lors de la connexion admin :", err);
        res.status(500).json({ error: "❌ Erreur serveur" });
    }
});

/* ================================
📌 CONNEXION MEMBRE
================================ */
router.post('/login/member', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "❌ Email et mot de passe sont requis." });
    }

    try {
        const member = await Member.findOne({ email });

        if (!member) {
            return res.status(401).json({ error: "❌ Membre introuvable." });
        }

        if (password !== member.password) {
            return res.status(401).json({ error: "❌ Mot de passe incorrect." });
        }

        const token = generateToken(member._id, "member");
        res.json({ token, user: { id: member._id, email: member.email, role: "member" } });

    } catch (err) {
        console.error("🚨 Erreur serveur lors de la connexion membre :", err);
        res.status(500).json({ error: "❌ Erreur serveur" });
    }
});

/* ================================
📌 INSCRIPTION ADMINISTRATEUR
================================ */
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
            password,  // ✅ Stocké en clair
            role: "admin"
        });

        await newAdmin.save();
        res.status(201).json({ message: "✅ Administrateur créé avec succès !" });

    } catch (err) {
        console.error("🚨 Erreur lors de l'inscription de l'admin :", err);
        res.status(500).json({ error: "❌ Erreur serveur" });
    }
});

/* ================================
📌 INSCRIPTION MEMBRE
================================ */
router.post('/register/member', async (req, res) => {
    const { firstName, lastName, email, phone, password } = req.body;

    if (!firstName || !lastName || !email || !phone || !password) {
        return res.status(400).json({ error: "❌ Tous les champs sont obligatoires." });
    }

    try {
        const existingMember = await Member.findOne({ email });
        if (existingMember) {
            return res.status(400).json({ error: "❌ Cet email est déjà utilisé !" });
        }

        const newMember = new Member({
            firstName,
            lastName,
            email,
            phone,
            password  // ✅ Stocké en clair
        });

        await newMember.save();
        res.status(201).json({ message: "✅ Inscription réussie !" });

    } catch (err) {
        console.error("🚨 Erreur lors de l'inscription du membre :", err);
        res.status(500).json({ error: "❌ Erreur serveur" });
    }
});

module.exports = router;