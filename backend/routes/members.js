const express = require("express");
const router = express.Router();
const Member = require("../models/Member");
const Wallet = require('../models/Wallet');


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

// ✅ Route pour mettre à jour un membre par son ID
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

/// ✅ Récupérer les affiliés d'un Sponsor
router.get("/sponsored/:sponsorId", async (req, res) => {
    try {
        const { sponsorId } = req.params;

        // Vérifie si le sponsor existe
        const sponsor = await Member.findById(sponsorId);
        if (!sponsor) {
            return res.status(404).json({ error: "❌ Sponsor non trouvé." });
        }

        // Recherche les membres qui ont ce sponsorId
        const affiliates = await Member.find({ sponsorId });

        res.json(affiliates);
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des affiliés :", error);
        res.status(500).json({ error: "❌ Erreur serveur" });
    }
});

// ✅ Obtenir les affiliés d'un membre
router.get("/:id/affiliates", async (req, res) => {
    try {
        const { id } = req.params;
        const affiliates = await Member.find({ sponsorId: id });
        res.json(affiliates);
    } catch (error) {
        res.status(500).json({ error: "❌ Erreur lors du chargement des affiliés." });
    }
});

/* ✅ Inscrire un Affilié (Admin ou Membre) */
router.post("/member/register", async (req, res) => {
    try {
        const { firstName, lastName, email, phone, address, country, password, sponsorId } = req.body;

        // Vérifier que tous les champs obligatoires sont bien remplis
        if (!firstName || !lastName || !email || !phone ) {
            return res.status(400).json({ error: "❌ Tous les champs requis ne sont pas fournis." });
        }

        // Vérifier si l'email existe déjà
        const existingMember = await Member.findOne({ email });
        if (existingMember) {
            return res.status(400).json({ error: "❌ Cet email est déjà utilisé." });
        }

        // Vérifier si le sponsor existe
        const sponsor = await Member.findById(sponsorId);
        if (!sponsor) {
            return res.status(400).json({ error: "❌ Le sponsor n'existe pas." });
        }

        // Création du nouveau membre
        const newMember = new Member({
            firstName,
            lastName,
            email,
            phone,
            address,
            country,
            password,  // ⚠️ Assure-toi que le mot de passe sera hashé dans un middleware !
            sponsorId,
            createdAt: Date.now() // Ajout automatique de la date du jour de création de l'affilié
        });

        await newMember.save();

        res.status(201).json({ message: "✅ Affilié enregistré avec succès", member: newMember });
    } catch (error) {
        console.error("❌ Erreur serveur :", error);
        res.status(500).json({ error: "❌ Erreur serveur." });
    }
});

module.exports = router;