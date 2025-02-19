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

// ✅ Inscrire un membre (Admin ou Membre)
router.post("/register", async (req, res) => {
    try {
        const { firstName, lastName, email, password, phone, address, role } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ error: "❌ Tous les champs Nom, prénom, email et mot de passe sont obligatoires." });
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
            phone,
            address,
            country: country || "Non spécifié",// Si country n'est pas fourni, mettre "Non spécifié"
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
router.delete('/members/:email', async (req, res) => {
    const { email } = req.params;

    try {
        const deletedMember = await Member.findOneAndDelete({ email });

        if (!deletedMember) {
            return res.status(404).json({ error: "❌ Membre non trouvé." });
        }

        res.json({ message: "✅ Membre supprimé avec succès." });
    } catch (error) {
        console.error("❌ Erreur lors de la suppression :", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updatedMember = await Member.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedMember) {
            return res.status(404).json({ error: "❌ Membre non trouvé." });
        }

        res.json({ message: "✅ Membre mis à jour avec succès", member: updatedMember });
    } catch (error) {
        console.error("❌ Erreur mise à jour membre :", error);
        res.status(500).json({ error: "❌ Erreur serveur lors de la mise à jour." });
    }
});

// ✅ Route pour récupérer un membre par son ID
router.get("/:id", async (req, res) => {
    try {
        const member = await Member.findById(req.params.id);
        if (!member) {
            return res.status(404).json({ error: "❌ Membre non trouvé." });
        }
        res.json(member);
    } catch (error) {
        console.error("❌ Erreur récupération membre :", error);
        res.status(500).json({ error: "❌ Erreur serveur." });
    }
});

module.exports = router;