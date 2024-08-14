const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const shoesRouter = require('./routes/shoes');
const usersRouter = require('./routes/users');
const cartRoutes = require('./routes/cart');
const paymentRoutes = require('./routes/payment');
const orderRoutes = require('./routes/orders');
const reviewRoutes = require('./routes/reviews');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/shoes', shoesRouter);
app.use('/api/users', usersRouter);
app.use('/api/cart', cartRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send('Shoe Shop API is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});