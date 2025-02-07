const express = require('express');
const jwt = require('jsonwebtoken');
const Member = require('../models/Member');
const Admin = require('../models/Admin');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '7d' });
};

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email et mot de passe sont requis." });
    }

    try {
        let user = await Admin.findOne({ email });
        let role = "admin";

        if (!user) {
            user = await Member.findOne({ email });
            role = "member";
        }

        if (!user) {
            return res.status(401).json({ error: "Utilisateur introuvable." });
        }

        if (password !== user.password) {
            return res.status(401).json({ error: "Mot de passe incorrect." });
        }

        const token = generateToken(user._id, role);
        res.json({ token, user: { id: user._id, email: user.email, role } });

    } catch (err) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// ✅ Inscription d'un administrateur (sans bcrypt)
router.post('/register/admin', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ error: "Tous les champs sont obligatoires." });
    }

    try {
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) return res.status(400).json({ error: "Cet email est déjà utilisé !" });

        const newAdmin = new Admin({
            firstName,
            lastName,
            email,
            password, // ✅ Stocké en clair
            role: "admin"
        });

        await newAdmin.save();
        res.status(201).json({ message: "✅ Administrateur créé avec succès !" });
    } catch (err) {
        res.status(500).json({ error: "Erreur serveur" });
    }
});

module.exports = router;