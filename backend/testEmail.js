require("dotenv").config(); // Charger les variables d'environnement
const nodemailer = require("nodemailer");

// ⚠️ Remplace par les informations de ton compte Ionos
const transporter = nodemailer.createTransport({
    host: "smtp.ionos.fr", // Serveur SMTP d'Ionos
    port: 465, // Port SMTP (587 pour TLS, 465 pour SSL)
    secure: true, // ⚠️ false pour TLS, true pour SSL
    auth: {
        user: process.env.EMAIL_USER, // Ton email Ionos
        pass: process.env.EMAIL_PASS  // Ton mot de passe Ionos
    }
});

async function sendTestEmail() {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER, // Expéditeur
            to: , // 📩 Remplace par ton adresse email de test
            subject: "🔑 Test de réinitialisation de mot de passe",
            text: "Ceci est un test d'envoi d'email depuis Node.js avec Ionos."
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Email envoyé :", info.response);
    } catch (error) {
        console.error("❌ Erreur lors de l'envoi de l'email :", error);
    }
}

// 📤 Exécuter le test
sendTestEmail();