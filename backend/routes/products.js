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

// Obtenir tous les produits
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
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

module.exports = router;