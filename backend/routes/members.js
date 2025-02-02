const express = require('express');
const router = express.Router();
const Member = require('../models/Member');

// Générer un ID unique pour chaque membre
const generateMemberId = () => {
    return "MLM-" + Math.floor(100000 + Math.random() * 900000);
};

// Ajouter un membre
router.post('/', async (req, res) => {
    try {
        const newMember = new Member({ ...req.body, memberId: generateMemberId() });
        await newMember.save();
        res.status(201).json(newMember);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Obtenir tous les membres
router.get('/', async (req, res) => {
    try {
        const members = await Member.find().populate('products sponsorId');
        res.json(members);
    } catch (err) {
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

module.exports = router;