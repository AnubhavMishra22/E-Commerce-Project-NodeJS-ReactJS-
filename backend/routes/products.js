const express = require('express');
const db = require('../models');
const Product = db.Product;
const router = express.Router();

// GET /api/products
router.get('/', async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products.', error: error.message });
    }
});

module.exports = router;