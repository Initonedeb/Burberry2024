const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const verifyToken = require('../middleware/verifyToken');

router.post('/create', verifyToken, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.shoe');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const order = new Order({
            user: req.user._id,
            items: cart.items,
            total: cart.items.reduce((total, item) => total + item.shoe.price * item.quantity, 0)
        });

        await order.save();

        // Clear the user's cart
        await Cart.findOneAndUpdate({ user: req.user._id }, { $set: { items: [] } });

        res.status(201).json({ message: 'Order created successfully', order });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Error creating order' });
    }
});

module.exports = router;