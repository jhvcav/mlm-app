const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true }, // ✅ Mot de passe en clair
    role: { type: String, default: "admin" }
});

module.exports = mongoose.model('Admin', AdminSchema);