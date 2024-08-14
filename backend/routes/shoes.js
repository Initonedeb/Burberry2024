// backend/routes/shoes.js
const express = require('express');
const router = express.Router();
const Shoe = require('../models/Shoe');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: "Access denied" });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: "Invalid token" });
    }
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(403).json({ message: "Access denied. Admin only." });
    }
};

// Get all shoes
router.get('/', async (req, res) => {
    try {
        const shoes = await Shoe.find();
        res.json(shoes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a specific shoe
router.get('/:id', getShoe, (req, res) => {
    res.json(res.shoe);
});

// Create a new shoe
router.post('/', verifyToken, isAdmin, async (req, res) => {
    const shoe = new Shoe({
        name: req.body.name,
        brand: req.body.brand,
        price: req.body.price,
        size: req.body.size,
        color: req.body.color,
        imageUrl: req.body.imageUrl,
        inStock: req.body.inStock,
        description: req.body.description
    });

    try {
        const newShoe = await shoe.save();
        res.status(201).json(newShoe);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a shoe
router.patch('/:id', verifyToken, isAdmin, getShoe, async (req, res) => {
    if (req.body.name != null) {
        res.shoe.name = req.body.name;
    }
    if (req.body.brand != null) {
        res.shoe.brand = req.body.brand;
    }
    if (req.body.price != null) {
        res.shoe.price = req.body.price;
    }
    if (req.body.size != null) {
        res.shoe.size = req.body.size;
    }
    if (req.body.color != null) {
        res.shoe.color = req.body.color;
    }
    if (req.body.imageUrl != null) {
        res.shoe.imageUrl = req.body.imageUrl;
    }
    if (req.body.inStock != null) {
        res.shoe.inStock = req.body.inStock;
    }
    if (req.body.description != null) {
        res.shoe.description = req.body.description;
    }

    try {
        const updatedShoe = await res.shoe.save();
        res.json(updatedShoe);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Toggle featured status of a shoe
router.patch('/:id/featured', verifyToken, isAdmin, async (req, res) => {
    try {
        const shoe = await Shoe.findById(req.params.id);
        if (!shoe) {
            return res.status(404).json({ message: 'Shoe not found' });
        }
        shoe.featured = !shoe.featured;
        const updatedShoe = await shoe.save();
        res.json(updatedShoe);
    } catch (error) {
        res.status(500).json({ message: 'Error updating featured status', error: error.message });
    }
});

// Delete a shoe
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const result = await Shoe.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ message: 'Shoe not found' });
        }
        res.json({ message: 'Shoe deleted successfully' });
    } catch (error) {
        console.error('Error deleting shoe:', error);
        res.status(500).json({ message: 'Error deleting shoe', error: error.message });
    }
});

// Middleware function to get a shoe by ID
async function getShoe(req, res, next) {
    let shoe;
    try {
        shoe = await Shoe.findById(req.params.id);
        if (shoe == null) {
            return res.status(404).json({ message: 'Cannot find shoe' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.shoe = shoe;
    next();
}

module.exports = router;