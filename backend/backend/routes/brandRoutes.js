const express = require('express');
const router = express.Router();
const { Brand } = require('../models');

// GET all brands
router.get('/', async (req, res) => {
    try {
        const brands = await Brand.findAll({
            where: { status: true }
        });
        res.json({
            status: 'success',
            data: brands
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

module.exports = router;
