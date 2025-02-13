const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: false },
    password: { type: String, required: true },
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

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Member', MemberSchema);