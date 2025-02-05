const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: false },
    name: { type: String, required: false },
    email: { type: String, required: false, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['member', 'admin'], default: 'member' }, // ✅ Ajout d'un rôle
    createdAt: { type: Date, default: Date.now }
});

// ✅ Hash du mot de passe avant l'enregistrement
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// ✅ Méthode pour comparer le mot de passe
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);