const express = require('express');
const router = express.Router();
const Member = require('../models/Member');

// Route de test
router.get('/test', (req, res) => {
    res.json({ message: "L'API fonctionne !" });
});

// Ajouter un membre
router.post('/', async (req, res) => {
    try {
        console.log("🔄 Tentative d'ajout d'un membre :", req.body);
        const newMember = new Member(req.body);
        await newMember.save();
        console.log("✅ Membre ajouté :", newMember);
        res.status(201).json(newMember);
    } catch (err) {
        console.error("❌ Erreur lors de l'ajout d'un membre :", err);
        res.status(500).json({ error: err.message });
    }
});

// Modifier un membre
router.put('/:id', async (req, res) => {
    try {
        const updatedMember = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedMember);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Supprimer un membre
router.delete('/:id', async (req, res) => {
    try {
        await Member.findByIdAndDelete(req.params.id);
        res.json({ message: 'Membre supprimé' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Log pour vérifier si la requête est bien reçue
router.get('/', async (req, res) => {
    console.log("📡 Requête GET reçue sur /api/members");
    try {
        const members = await Member.find();
        console.log("✅ Données récupérées :", members);
        res.json(members);
    } catch (err) {
        console.error("❌ Erreur dans /api/members :", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;