const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connexion MongoDB
const URI = process.env.MONGO_URI;
mongoose.connect(URI)
    .then(() => console.log('🟢 MongoDB connecté'))
    .catch(err => console.error('🔴 Erreur MongoDB:', err));

// Routes API
app.use('/api/members', require('./routes/members'));
app.use('/api/products', require('./routes/products'));
app.use('/api/wallets', require('./routes/wallets'));
app.use('/api/progress', require('./routes/progress'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Serveur tournant sur http://localhost:${PORT}`);
});