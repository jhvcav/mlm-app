const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

console.log("MONGO_URI:", process.env.MONGO_URI); // Debugging: affiche l'URI
if (!process.env.MONGO_URI) {
    console.error("❌ ERREUR: MONGO_URI n'est pas défini !");
    process.exit(1);
}

const app = express();

// ✅ Middlewares
app.use(cors());
app.use(express.json());

// ✅ Connexion à MongoDB
const connectDB = async () => {
    try {
        console.log("🔄 Tentative de connexion à MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log('🟢 MongoDB connecté avec succès !');
    } catch (error) {
        console.error('🔴 Erreur de connexion à MongoDB:', error);
        process.exit(1); // Arrête le serveur si la connexion échoue
    }
};

connectDB(); // Connexion immédiate à MongoDB

// ✅ Routes Auth (chargée en premier)
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
console.log("🚀 API Auth chargée : /api/auth");

// ✅ Autres Routes API
app.use('/api/members', require('./routes/members'));
app.use('/api/products', require('./routes/products'));
app.use('/api/wallets', require('./routes/wallets'));

console.log("🚀 API Wallets chargée : /api/wallets");

// ✅ Route d'accueil pour vérifier le bon fonctionnement du serveur
app.get('/', (req, res) => {
    res.json({ message: "🚀 Serveur MLM en ligne !" });
});

// Servir le frontend React en production
const path = require("path");

app.use(express.static(path.join(__dirname, "frontend/build")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend/build", "index.html"));
});

// ✅ Démarrage du serveur avec PORT dynamique pour Fly.io
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Serveur lancé sur http://0.0.0.0:${PORT} 🚀`);
});

const memberRoutes = require('./routes/members');
app.use('/api', memberRoutes);

// Vérifie si l'importation retourne bien une fonction
if (typeof membersRoutes === 'function') {
    app.use('/api/members', membersRoutes);
} else {
    console.error("❌ Erreur : 'membersRoutes' n'est pas une fonction valide.");
}

// Servir React pour toutes les routes inconnues
app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});