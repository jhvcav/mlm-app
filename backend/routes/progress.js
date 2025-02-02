const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');

// Ajouter une progression
router.post('/', async (req, res) => {
    try {
        const newProgress = new Progress(req.body);
        await newProgress.save();
        res.status(201).json(newProgress);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Obtenir toutes les progressions
router.get('/', async (req, res) => {
    try {
        const progressData = await Progress.find().populate('memberId');
        res.json(progressData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Modifier une progression
router.put('/:id', async (req, res) => {
    try {
        const updatedProgress = await Progress.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedProgress);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Supprimer une progression
router.delete('/:id', async (req, res) => {
    try {
        await Progress.findByIdAndDelete(req.params.id);
        res.json({ message: 'Progression supprimée' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;