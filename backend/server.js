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

// ✅ Démarrage du serveur avec PORT dynamique pour Render
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚀 Serveur lancé sur http://localhost:${PORT} 🚀`);
});