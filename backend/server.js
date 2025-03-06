const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

console.log("🔍 JWT_SECRET:", process.env.JWT_SECRET ? "✅ Détecté" : "❌ NON DÉFINI");
console.log("🔍 EMAIL_USER:", process.env.EMAIL_USER);
console.log("🔍 EMAIL_PASS:", process.env.EMAIL_PASS ? "✅ Détecté" : "❌ NON DÉFINI");

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
const resetRoutes = require("./routes/reset");

app.use("/api/reset", resetRoutes);
console.log("🚀 Route chargée : /api/reset");

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

app.use((err, req, res, next) => {
    console.error("❌ Erreur détectée :", err);
    res.status(500).json({ error: err.message, details: err.stack });
});

// ✅ Démarrage du serveur
const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Serveur lancé sur http://0.0.0.0:${PORT}`));