const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String },
    sponsorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' }, // Parrainage
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Member', MemberSchema);