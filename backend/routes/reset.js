const express = require("express");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken"); // 🔹 Ajout du package JWT pour le token
const Member = require("../models/Member"); // 🔹 Import du modèle des utilisateurs (ajuste selon ta structure)
require("dotenv").config();

const router = express.Router();

router.post("/reset-password", async (req, res) => {
    const { email } = req.body;

    console.log("📨 [RESET PASSWORD] Demande reçue pour :", email);

    if (!email) {
        console.error("❌ [RESET PASSWORD] Email non fourni !");
        return res.status(400).json({ error: "❌ Email requis." });
    }

    try {
        // 🔍 **Rechercher l'utilisateur dans la base de données**
        const user = await Member.findOne({ email });
        if (!user) {
            console.error("❌ [RESET PASSWORD] Email non trouvé dans la base !");
            return res.status(404).json({ error: "❌ Email non trouvé." });
        }

        // 🔑 **Génération d'un token JWT**
        const resetToken = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" } // ⏳ Expiration du token en 1 heure
        );

        // 🔗 **Création du lien de réinitialisation**
        const resetLink = `https://mlm-app-jhc.fly.dev/reset-password?token=${resetToken}`;

        console.log("🔗 [RESET PASSWORD] Lien généré :", resetLink);

        // 📨 **Configuration SMTP pour l'envoi d'email**
        const transporter = nodemailer.createTransport({
            host: "smtp.ionos.fr",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // 📤 **Préparation et envoi de l'email**
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "🔑 Réinitialisation de votre mot de passe",
            text: `Bonjour,\n\nVous avez demandé une réinitialisation de votre mot de passe.\n\nCliquez sur ce lien pour réinitialiser votre mot de passe :\n\n${resetLink}\n\n⚠️ Ce lien expirera dans 1 heure.\n\nSi vous n'avez pas fait cette demande, ignorez cet email.`,
            html: `<p>Bonjour,</p>
                   <p>Vous avez demandé une réinitialisation de votre mot de passe.</p>
                   <p><a href="${resetLink}">🔗 Cliquez ici pour réinitialiser votre mot de passe</a></p>
                   <p>⚠️ Ce lien expirera dans <strong>1 heure</strong>.</p>
                   <p>Si vous n'avez pas fait cette demande, ignorez cet email.</p>
                   <p> </p>
                   <p>Cordialement,</p)
                   <p>Jean</p>`
        };

        const info = await transporter.sendMail(mailOptions);
        
        console.log("✅ [RESET PASSWORD] Email envoyé avec succès :", info.response);
        res.json({ message: "✅ Email envoyé avec succès." });

    } catch (err) {
        console.error("🚨 [RESET PASSWORD] Erreur lors de l'envoi du mail :", err);
        res.status(500).json({ error: "❌ Erreur serveur." });
    }
});

// ✅ **Exporter la route**
module.exports = router;