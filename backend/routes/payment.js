const express = require('express');
const router = express.Router();
const mercadopago = require('mercadopago');
const verifyToken = require('../middleware/verifyToken');
const Cart = require('../models/Cart');

const client = new mercadopago.MercadoPagoConfig({
    accessToken: 'TEST-6810946048325863-070810-2d3a46c29f20bdd4bd06f85376bf5df2-564216041'
});

router.post('/create_preference', verifyToken, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.shoe');
        if (!cart) {
            console.log('Cart not found for user:', req.user._id);
            return res.status(404).json({ message: 'Cart not found' });
        }

        console.log('Cart found:', cart);

        const items = cart.items.map(item => ({
            title: item.shoe.name,
            unit_price: Number(item.shoe.price),
            quantity: item.quantity,
        }));

        console.log('Mapped items:', items);

        let preferenceData = {
            items: items,
            back_urls: {
                success: "http://localhost:3000/success",
                failure: "http://localhost:3000/failure",
                pending: "http://localhost:3000/pending"
            },
            auto_return: "approved",
        };

        console.log('Preference data:', preferenceData);

        const preference = new mercadopago.Preference(client);
        const response = await preference.create({ body: preferenceData });

        console.log('MercadoPago response:', response);

        res.json({ id: response.id });
    } catch (error) {
        console.error('Detailed error in create_preference:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ message: 'Error creating payment preference', error: error.message });
    }
});
module.exports = router;