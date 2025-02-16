const express = require("express");
const router = express.Router();
const Member = require("../models/Member");

// ✅ Récupérer la liste des membres
router.get("/", async (req, res) => {
    try {
        const members = await Member.find();
        res.json(members);
    } catch (err) {
        console.error("❌ Erreur lors de la récupération des membres :", err);
        res.status(500).json({ error: "Erreur serveur." });
    }
});

// ✅ Récupérer la liste des admins
router.get('/auth/admins', async (req, res) => {
    try {
        const admins = await Member.find({ role: "admin" }); // 🔥 Filtre sur le champ "role"
        res.json(admins);
    } catch (err) {
        console.error("❌ Erreur lors de la récupération des admins :", err);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});

// ✅ Inscrire un membre (Admin ou Membre)
router.post("/register", async (req, res) => {
    try {
        const { firstName, lastName, email, password, role } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ error: "❌ Tous les champs sont obligatoires." });
        }

        const existingUser = await Member.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "❌ Cet email est déjà utilisé." });
        }

        const newUser = new Member({
            firstName,
            lastName,
            email,
            password,
            role: role || "member"
        });

        await newUser.save();
        res.status(201).json({ message: "✅ Membre inscrit avec succès !" });
    } catch (err) {
        console.error("🚨 Erreur lors de l'inscription :", err);
        res.status(500).json({ error: "❌ Erreur serveur." });
    }
});

// ✅ Modifier les permissions d'un membre
router.put("/update-permissions/:id", async (req, res) => {
    try {
        const { permissions } = req.body;
        const { id } = req.params;

        if (!permissions) {
            return res.status(400).json({ error: "❌ Aucune permission fournie." });
        }

        const updatedUser = await Member.findByIdAndUpdate(id, { permissions }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ error: "❌ Membre non trouvé." });
        }

        res.json({ message: "✅ Permissions mises à jour avec succès.", user: updatedUser });
    } catch (err) {
        console.error("🚨 Erreur lors de la mise à jour des permissions :", err);
        res.status(500).json({ error: "❌ Erreur serveur." });
    }
});

// ✅ Supprimer un membre
router.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await Member.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ error: "❌ Membre non trouvé." });
        }

        res.json({ message: "✅ Membre supprimé avec succès." });
    } catch (err) {
        console.error("🚨 Erreur lors de la suppression du membre :", err);
        res.status(500).json({ error: "❌ Erreur serveur." });
    }
});

module.exports = router;