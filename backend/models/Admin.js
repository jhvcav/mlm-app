const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    address: { type: String },
    country: { type: String, default: "Non spécifié" },
    password: { type: String, required: true },
    
    activitylog: [{ type: [String], default: []}],
    createdAt: { type: Date, default: Date.now},
});

module.exports = mongoose.model('Admin', AdminSchema);