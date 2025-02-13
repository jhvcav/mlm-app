const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("🟢 MongoDB connecté avec succès !"))
    .catch(err => {
        console.error("🔴 Erreur de connexion MongoDB :", err);
        process.exit(1);
    });

// ✅ Importation des routes
const authRoutes = require('./routes/auth');
const membersRoutes = require('./routes/members');
const productsRoutes = require('./routes/products');
const walletsRoutes = require('./routes/wallets');

app.use('/api/auth', authRoutes);
console.log("🚀 Route chargée : /api/auth");

app.use('/api/members', membersRoutes);
console.log("🚀 Route chargée : /api/members");

app.use('/api/products', productsRoutes);
console.log("🚀 Route chargée : /api/products");

app.use('/api/wallets', walletsRoutes);
console.log("🚀 Route chargée : /api/wallets");

// ✅ Route principale
app.get('/', (req, res) => {
    res.json({ message: "🚀 Serveur en ligne !" });
});

// ✅ Démarrage du serveur
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`));