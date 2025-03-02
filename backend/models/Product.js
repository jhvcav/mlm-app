const mongoose = require("mongoose"); // ✅ Import de mongoose

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    amountInvested: { type: Number, required: true },
    subscriptionDate: { type: Date, required: true },
    duration: { type: String, required: true },
    yeld: { type: Number, required: false },
    description: { type: String, required: false },
    membersSubscribed: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Member' }],

    // 🔹 Nouveau champ pour suivre chaque souscription avec détails
    subscriptions: [{
        memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
        amountInvested: { type: Number, required: true },
        subscriptionDate: { type: Date, required: true }
    }]
});

module.exports = mongoose.model("Product", ProductSchema);