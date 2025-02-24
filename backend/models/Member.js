const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: false },
    password: { type: String, required: true },
    address: { type: String, required: false},
    country: { type: String, required: false, default: "Non spécifié" },
    affiliates: [{ type: mongoose.Schema.Types.ObjectId, ref: "Member" }], // 🔹 Liste des affiliés
    sponsorId: { type: mongoose.Schema.Types.ObjectId, ref: "Member" }, // ✅ Référence au modèle Member
    wallets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Wallet' }],
    role: { 
        type: String, 
        enum: ['superadmin', 'admin', 'member'], 
        default: 'member' 
    },  // 🎯 Définition des rôles

    permissions: { 
        type: Object, 
        default: {
            canCreateAdmin: false,
            canCreateMember: true,
            canDeleteUser: false,
            canEditUser: false,
            canAccessSuperAdminDashboard: false,
            canAccessAdminDashboard: false
        } 
    }, // ✅ Permissions personnalisées

    activityLog: [{ type: [String], default: [] }], // ✅ Ajout de l'historique des actions

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Member', MemberSchema);