const express = require('express');
const jwt = require('jsonwebtoken');
const Member = require('../models/Member');
const nodemailer = require('nodemailer');
const router = express.Router();

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

// ✅ Connexion et génération de token
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

        // 🔹 Vérification du mot de passe (sans hashage)
        if (password !== user.password) {
            return res.status(401).json({ error: "Mot de passe incorrect." });
        }

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

// ✅ Route pour demander la réinitialisation du mot de passe
router.post('/reset-password', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "❌ Email requis." });
    }

    try {
        const user = await Member.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "❌ Email non trouvé." });
        }

        // Génération d'un token unique pour réinitialisation (expiration courte)
        const resetToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
        const resetLink = `https://mlm-app-jhc.fly.dev/reset-password?token=${resetToken}`;

        // Configuration du transporteur email
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Envoi de l'email avec le lien de réinitialisation
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "🔄 Réinitialisation de votre mot de passe",
            html: `<p>Bonjour,</p><p>Vous avez demandé une réinitialisation de mot de passe.</p><p>👉 <a href="${resetLink}">Cliquez ici pour réinitialiser votre mot de passe</a></p><p>Ce lien expirera dans 1 heure.</p>`
        });

        res.json({ message: "✅ Un email de réinitialisation a été envoyé !" });

    } catch (err) {
        console.error("🚨 Erreur d'envoi d'email :", err);
        res.status(500).json({ error: "❌ Erreur serveur" });
    }
});

// ✅ Route pour changer le mot de passe après vérification du token
router.post('/new-password', async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return res.status(400).json({ error: "❌ Token et nouveau mot de passe requis." });
    }

    try {
        // Vérification du token
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await Member.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ error: "❌ Utilisateur non trouvé." });
        }

        // 🔹 Mise à jour du mot de passe directement (sans cryptage)
        user.password = newPassword;
        await user.save();

        res.json({ message: "✅ Mot de passe mis à jour avec succès !" });

    } catch (err) {
        console.error("🚨 Erreur lors de la réinitialisation du mot de passe :", err);
        res.status(500).json({ error: "❌ Erreur serveur" });
    }
});

module.exports = router;