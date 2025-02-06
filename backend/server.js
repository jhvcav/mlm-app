const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// ✅ Middlewares
app.use(cors());
app.use(express.json());

// ✅ Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('🟢 MongoDB connecté'))
    .catch(err => console.error('🔴 Erreur MongoDB:', err));

// ✅ Routes API
app.use('/api/members', require('./routes/members'));
app.use('/api/products', require('./routes/products'));
app.use('/api/wallets', require('./routes/wallets'));

console.log("🚀 API Wallets chargée : /api/wallets");

// ✅ Routes Auth (Doit être chargé en premier)
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
console.log("🚀 API Auth chargée : /api/auth");

// ✅ Démarrage du serveur avec PORT dynamique pour Render
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚀 Serveur tournant sur http://localhost:${PORT}`);
});