const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Ajouter un produit
router.post('/', async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Route pour récupérer la liste des produits
router.get('/', async (req, res) => {
    try {
        console.log("📌 Récupération des produits...");

        const products = await Product.find();

        if (!products || products.length === 0) {
            console.log("⚠️ Aucun produit trouvé.");
            return res.status(404).json({ message: "⚠️ Aucun produit trouvé." });
        }

        console.log("✅ Produits récupérés :", products.length);
        res.json(products);
    } catch (err) {
        console.error("❌ Erreur lors de la récupération des produits :", err);
        res.status(500).json({ error: "Erreur interne du serveur.", details: err.message });
    }
});

// Modifier un produit
router.put('/:id', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id, // Récupère l'ID du produit
            req.body,      // Met à jour les champs avec ceux envoyés dans la requête
            { new: true }  // Retourne l'objet mis à jour
        );

        if (!updatedProduct) {
            return res.status(404).json({ error: "Produit non trouvé" });
        }

        res.json(updatedProduct);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Route pour qu'un membre souscrive à un produit
router.post('/subscribe/:productId', async (req, res) => {
    try {
        console.log("📌 Requête reçue pour souscription !");
        console.log("🔹 Paramètres de l'URL :", req.params);
        console.log("🔹 Corps de la requête :", req.body);

        const { memberId, amountInvested, subscriptionDate } = req.body;
        const { productId } = req.params;

        if (!memberId || !productId || !amountInvested || !subscriptionDate) {
            return res.status(400).json({ error: "⛔ L'ID du membre, le montant investi et la date de souscription sont requis." });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: "❌ Produit introuvable." });
        }

        if (product.membersSubscribed.includes(memberId)) {
            return res.status(400).json({ error: "⚠️ Vous êtes déjà inscrit à ce produit." });
        }

        // Ajouter le membre à la liste des abonnés
        product.membersSubscribed.push(memberId);

        // Vérifier si `subscriptions` existe avant d'ajouter
        product.subscriptions = product.subscriptions || [];
        product.subscriptions.push({ memberId, amountInvested, subscriptionDate });

        await product.save();

        res.json({ message: "✅ Souscription réussie !", product });
    } catch (err) {
        console.error("❌ Erreur lors de la souscription :", err);
        res.status(500).json({ error: "Erreur interne du serveur.", details: err.message });
    }
});

// Supprimer un produit par ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        if (!deletedProduct) {
            return res.status(404).json({ error: "❌ Produit non trouvé." });
        }

        res.json({ message: "✅ Produit supprimé avec succès." });
    } catch (err) {
        console.error("❌ Erreur lors de la suppression du produit :", err);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});

// ✅ Récupérer les produits souscrits par un membre
router.get('/subscribed/:memberId', async (req, res) => {
    try {
        const { memberId } = req.params;

        // Vérifier si l'ID du membre est valide
        if (!memberId) {
            return res.status(400).json({ error: "⛔ ID du membre requis." });
        }

        // Trouver tous les produits où ce membre est inscrit
        const subscribedProducts = await Product.find({ membersSubscribed: memberId });

        if (subscribedProducts.length === 0) {
            return res.json([]); // Retourne un tableau vide si aucun produit souscrit
        }

        res.json(subscribedProducts);
    } catch (err) {
        console.error("❌ Erreur lors de la récupération des produits souscrits :", err);
        res.status(500).json({ error: "Erreur interne du serveur.", details: err.message });
    }
});

// ✅ Annuler la souscription à un produit
router.delete('/unsubscribe/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        const { memberId } = req.body;

        if (!memberId) {
            return res.status(400).json({ error: "⛔ ID du membre requis." });
        }

        // Retirer le membre de la liste `membersSubscribed`
        const product = await Product.findByIdAndUpdate(
            productId,
            { $pull: { membersSubscribed: memberId, subscriptions: { memberId: memberId } } },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ error: "❌ Produit non trouvé." });
        }

        res.json({ message: "✅ Souscription annulée avec succès.", product });
    } catch (err) {
        console.error("❌ Erreur lors de l'annulation de la souscription :", err);
        res.status(500).json({ error: "Erreur interne du serveur.", details: err.message });
    }
});

// ✅ Supprimer une souscription d'un membre à un produit
router.delete('/unsubscribe/:productId/:memberId', async (req, res) => {
    try {
        const { productId, memberId } = req.params;

        // Vérifier si le produit existe
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: "❌ Produit introuvable." });
        }

        // Vérifier si le membre est inscrit à ce produit
        const subscriptionIndex = product.subscriptions.findIndex(sub => sub.memberId.toString() === memberId);
        if (subscriptionIndex === -1) {
            return res.status(404).json({ error: "⚠️ Le membre n'est pas inscrit à ce produit." });
        }

        // Supprimer la souscription du tableau
        product.subscriptions.splice(subscriptionIndex, 1);

        // Supprimer le membre de la liste `membersSubscribed`
        product.membersSubscribed = product.membersSubscribed.filter(id => id.toString() !== memberId);

        // Sauvegarder les modifications
        await product.save();

        res.json({ message: "✅ Souscription supprimée avec succès !" });
    } catch (err) {
        console.error("❌ Erreur lors de la suppression de la souscription :", err);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});

// ✅ Obtenir un produit par son ID
router.get('/:productId', async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId);
        if (!product) {
            return res.status(404).json({ error: "❌ Produit introuvable." });
        }
        res.json(product);
    } catch (err) {
        console.error("❌ Erreur lors de la récupération du produit :", err);
        res.status(500).json({ error: "Erreur interne du serveur." });
    }
});

// ✅ Modifier une souscription existante
router.put('/update-subscription/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        const { amountInvested, subscriptionDate, memberId } = req.body;

        if (!memberId) {
            return res.status(400).json({ error: "⛔ ID du membre requis." });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: "❌ Produit non trouvé." });
        }

        // Met à jour les données de la souscription du membre
        const updatedProduct = await Product.findOneAndUpdate(
            { _id: productId, "subscriptions.memberId": memberId },
            { 
                $set: { 
                    "subscriptions.$.amountInvested": amountInvested,
                    "subscriptions.$.subscriptionDate": subscriptionDate
                } 
            },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ error: "❌ Souscription non trouvée." });
        }

        res.json({ message: "✅ Souscription mise à jour avec succès.", updatedProduct });
    } catch (err) {
        console.error("❌ Erreur lors de la mise à jour de la souscription :", err);
        res.status(500).json({ error: "Erreur interne du serveur.", details: err.message });
    }
});

module.exports = router;