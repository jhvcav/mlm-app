const express = require("express");
const router = express.Router();
const Member = require("../models/Member");
const Wallet = require('../models/Wallet');
const Product = require("../models/Product");
const authMiddleware = require("./auth");


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
router.delete('/members/:id', async (req, res) => {
    const { id } = req.params;

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

// ✅ Route pour récupérer les affiliés et leurs produits souscrits
router.get("/all-affiliates-products/:userId", authMiddleware, async (req, res) => {
    try {
        const { userId } = req.params;

        // Vérifie si l'utilisateur existe
        const user = await Member.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        // Récupérer les affiliés directs de l'utilisateur
        const affiliates = await Member.find({ sponsorId: userId });

        // Ajouter les produits souscrits pour chaque affilié
        const affiliatesWithProducts = await Promise.all(
            affiliates.map(async (affiliate) => {
                console.log(`🔍 Recherche des produits pour l'affilié : ${affiliate.firstName} (${affiliate._id})`);

                const products = await Product.find({
                    $or: [
                        { membersSubscribed: affiliate._id }, // Vérifie si l'affilié est dans membersSubscribed
                        { "subscriptions.memberId": affiliate._id } // Vérifie si l'affilié est dans subscriptions
                    ]
                });

                console.log(`✅ Produits trouvés pour ${affiliate.firstName}:`, products.length);

                return {
                    _id: affiliate._id,
                    firstName: affiliate.firstName,
                    lastName: affiliate.lastName,
                    email: affiliate.email,
                    products: products.map((product) => ({
                        _id: product._id,
                        name: product.name,
                        amountInvested: product.amountInvested,
                        subscriptionDate: product.subscriptionDate,
                        duration: product.duration,
                        yeld: product.yeld,
                        description: product.description,
                    })),
                };
            })
        );

        res.json(affiliatesWithProducts);
    } catch (error) {
        console.error("❌ Erreur API /all-affiliates-products :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

router.get("/all-members-products", authMiddleware, async (req, res) => {
    try {
        console.log("✅ Requête reçue sur /all-members-products");

        const userId = req.user._id;
        console.log(`🔹 ID utilisateur reçu : ${userId}`);

        const user = await Member.findById(userId);
        if (!user) {
            console.error("❌ Utilisateur non trouvé :", userId);
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }

        console.log(`🔹 Utilisateur authentifié : ${user.email}, rôle : ${user.role}`);

        if (user.role !== "superadmin") {
            console.error("🚨 Accès refusé : l'utilisateur n'est pas superadmin.");
            return res.status(403).json({ message: "Accès refusé. Seuls les superadmins peuvent voir tous les membres et produits." });
        }

        console.log("🔹 Récupération de tous les membres...");
        const allMembers = await Member.find();
        console.log(`✅ ${allMembers.length} membres récupérés`);

        const membersWithProducts = await Promise.all(
            allMembers.map(async (member) => {
                try {
                    console.log(`🔍 Recherche des produits pour ${member.firstName} (${member._id})`);
                    
                    // 🔹 Vérifier le type de _id avant la requête
                    console.log(`📌 Type de member._id : ${typeof member._id}, Valeur : ${member._id}`);

                    const products = await Product.find({
                        $or: [
                            { membersSubscribed: mongoose.Types.ObjectId(member._id) }, 
                            { "subscriptions.memberId": mongoose.Types.ObjectId(member._id) } 
                        ]
                    });

                    console.log(`✅ Produits trouvés pour ${member.firstName}:`, products.length);

                    return {
                        _id: member._id,
                        firstName: member.firstName,
                        lastName: member.lastName,
                        email: member.email,
                        role: member.role,
                        products: products.map((product) => ({
                            _id: product._id,
                            name: product.name,
                            amountInvested: product.amountInvested,
                            subscriptionDate: product.subscriptionDate,
                            duration: product.duration,
                            yeld: product.yeld,
                            description: product.description,
                        })),
                    };
                } catch (productError) {
                    console.error(`❌ Erreur lors de la récupération des produits pour ${member.email}:`, productError);
                    return { error: "❌ Erreur récupération produits", details: productError.message };
                }
            })
        );

        res.json(membersWithProducts);
    } catch (error) {
        console.error("❌ Erreur API /all-members-products :", error);
        res.status(500).json({ error: error.message, details: error.stack });
    }
});

module.exports = router;