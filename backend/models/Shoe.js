// backend/models/Shoe.js
const mongoose = require('mongoose');

const ShoeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    size: { type: Number, required: true },
    color: { type: String, required: true },
    imageUrl: { type: String },
    inStock: { type: Boolean, default: true },
    description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Shoe', ShoeSchema);
