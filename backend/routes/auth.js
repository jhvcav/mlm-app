const express = require('express');
const jwt = require('jsonwebtoken');
const Member = require('../models/Member');
const nodemailer = require('nodemailer');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// ✅ Générer un token JWT
const generateToken = (id, role, permissions) => {
    return jwt.sign({ id, role, permissions }, JWT_SECRET, { expiresIn: '7d' });
};

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

        const resetToken = generateToken(user._id, user.role, user.permissions);
        const resetLink = `https://mlm-app-jhc.fly.dev/reset-password?token=${resetToken}`;

        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "🔄 Réinitialisation de votre mot de passe",
            html: `<p>Bonjour,</p><p>Vous avez demandé une réinitialisation de mot de passe.</p><p>👉 <a href="${resetLink}">Cliquez ici pour réinitialiser votre mot de passe</a></p>`
        });

        res.json({ message: "✅ Un email de réinitialisation a été envoyé !" });
    } catch (err) {
        console.error("🚨 Erreur d'envoi d'email :", err);
        res.status(500).json({ error: "❌ Erreur serveur" });
    }
});

module.exports = router;