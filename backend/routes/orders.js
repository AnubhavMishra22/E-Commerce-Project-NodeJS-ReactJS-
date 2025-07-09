const express = require('express');
const db = require('../models');
const { Order, OrderItem, Product } = db;
const router = express.Router();

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: 'You must be logged in to do that.' });
};

// POST /api/orders
router.post('/', isAuthenticated, async (req, res) => {
    const { cart } = req.body; // Expects cart = [{id, name, price, quantity}, ...]
    const userId = req.user.id;

    if (!cart || cart.length === 0) {
        return res.status(400).json({ message: 'Cart is empty.' });
    }

    const transaction = await db.sequelize.transaction();

    try {
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

        const order = await Order.create({
            userId,
            total
        }, { transaction });

        const orderItems = cart.map(item => ({
            orderId: order.id,
            productId: item.id,
            quantity: item.quantity,
            price: item.price
        }));

        await OrderItem.bulkCreate(orderItems, { transaction });

        await transaction.commit();
        res.status(201).json(order);

    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ message: 'Error creating order.', error: error.message });
    }
});

// GET /api/orders
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: { userId: req.user.id },
            include: [{
                model: OrderItem,
                include: [Product] // Include product details in each order item
            }],
            order: [['createdAt', 'DESC']] // Newest orders first
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders.', error: error.message });
    }
});

module.exports = router;