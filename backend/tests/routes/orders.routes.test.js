// Unit tests for Order routes

const request = require('supertest');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const { sequelize } = require('../helpers/testDb');
const { mockCart } = require('../mocks/mockData');

// Initialize models
const UserModel = require('../../models/user.model');
const ProductModel = require('../../models/product.model');
const OrderModel = require('../../models/order.model');
const OrderItemModel = require('../../models/orderItem.model');

const User = UserModel(sequelize, require('sequelize').DataTypes);
const Product = ProductModel(sequelize, require('sequelize').DataTypes);
const Order = OrderModel(sequelize, require('sequelize').DataTypes);
const OrderItem = OrderItemModel(sequelize, require('sequelize').DataTypes);

// Set up associations
User.hasMany(Order);
Order.belongsTo(User);
Order.hasMany(OrderItem);
OrderItem.belongsTo(Order);
Product.hasMany(OrderItem);
OrderItem.belongsTo(Product);

// Create express app for testing
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup session
app.use(session({
    secret: 'test-secret',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

// Mock authentication middleware for testing
const mockAuthMiddleware = async (req, res, next) => {
    const user = await User.findOne();
    if (user) {
        req.user = user;
        req.isAuthenticated = () => true;
    } else {
        req.isAuthenticated = () => false;
    }
    next();
};

app.use(mockAuthMiddleware);

// Import order routes
const orderRoutes = require('../../routes/orders');
app.use('/api/orders', orderRoutes);

describe('Order Routes Tests', () => {
    let testUser;
    let testProducts;

    beforeAll(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    beforeEach(async () => {
        // Create test user
        testUser = await User.create({
            email: 'testuser@example.com',
            password: 'password123'
        });

        // Create test products
        testProducts = await Product.bulkCreate([
            { name: 'Product 1', price: 29.99 },
            { name: 'Product 2', price: 49.99 }
        ]);
    });

    afterEach(async () => {
        await OrderItem.destroy({ where: {}, truncate: true });
        await Order.destroy({ where: {}, truncate: true });
        await Product.destroy({ where: {}, truncate: true });
        await User.destroy({ where: {}, truncate: true });
    });

    describe('POST /api/orders', () => {
        test('should create a new order with valid cart', async () => {
            const cart = [
                {
                    id: testProducts[0].id,
                    name: testProducts[0].name,
                    price: parseFloat(testProducts[0].price),
                    quantity: 2
                }
            ];

            const response = await request(app)
                .post('/api/orders')
                .send({ cart });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body).toHaveProperty('total');
            expect(parseFloat(response.body.total)).toBe(59.98);
        });

        test('should fail to create order with empty cart', async () => {
            const response = await request(app)
                .post('/api/orders')
                .send({ cart: [] });

            expect(response.status).toBe(400);
            expect(response.body.message).toContain('Cart is empty');
        });

        test('should fail to create order without cart', async () => {
            const response = await request(app)
                .post('/api/orders')
                .send({});

            expect(response.status).toBe(400);
        });

        test('should create order with multiple items', async () => {
            const cart = [
                {
                    id: testProducts[0].id,
                    name: testProducts[0].name,
                    price: parseFloat(testProducts[0].price),
                    quantity: 2
                },
                {
                    id: testProducts[1].id,
                    name: testProducts[1].name,
                    price: parseFloat(testProducts[1].price),
                    quantity: 1
                }
            ];

            const response = await request(app)
                .post('/api/orders')
                .send({ cart });

            expect(response.status).toBe(201);
            const expectedTotal = (29.99 * 2) + (49.99 * 1);
            expect(parseFloat(response.body.total)).toBeCloseTo(expectedTotal, 2);
        });

        test('should create order with correct user association', async () => {
            const cart = [
                {
                    id: testProducts[0].id,
                    name: testProducts[0].name,
                    price: parseFloat(testProducts[0].price),
                    quantity: 1
                }
            ];

            const response = await request(app)
                .post('/api/orders')
                .send({ cart });

            expect(response.status).toBe(201);

            const order = await Order.findByPk(response.body.id);
            expect(order.userId).toBe(testUser.id);
        });

        test('should create order items with snapshot prices', async () => {
            const cart = [
                {
                    id: testProducts[0].id,
                    name: testProducts[0].name,
                    price: parseFloat(testProducts[0].price),
                    quantity: 2
                }
            ];

            const response = await request(app)
                .post('/api/orders')
                .send({ cart });

            expect(response.status).toBe(201);

            const orderItems = await OrderItem.findAll({ where: { orderId: response.body.id } });
            expect(orderItems).toHaveLength(1);
            expect(parseFloat(orderItems[0].price)).toBe(parseFloat(testProducts[0].price));
            expect(orderItems[0].quantity).toBe(2);
        });
    });

    describe('GET /api/orders', () => {
        test('should return all orders for authenticated user', async () => {
            // Create orders
            const order1 = await Order.create({
                userId: testUser.id,
                total: 100.00
            });
            const order2 = await Order.create({
                userId: testUser.id,
                total: 200.00
            });

            const response = await request(app)
                .get('/api/orders');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body).toHaveLength(2);
        });

        test('should return empty array when user has no orders', async () => {
            const response = await request(app)
                .get('/api/orders');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body).toHaveLength(0);
        });

        test('should return orders with order items and products', async () => {
            const order = await Order.create({
                userId: testUser.id,
                total: 59.98
            });

            await OrderItem.create({
                orderId: order.id,
                productId: testProducts[0].id,
                quantity: 2,
                price: testProducts[0].price
            });

            const response = await request(app)
                .get('/api/orders');

            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(1);
            expect(response.body[0]).toHaveProperty('orderItems');
            expect(response.body[0].orderItems).toHaveLength(1);
            expect(response.body[0].orderItems[0]).toHaveProperty('product');
        });

        test('should return orders sorted by creation date descending', async () => {
            const order1 = await Order.create({
                userId: testUser.id,
                total: 100.00,
                createdAt: new Date('2024-01-01')
            });
            const order2 = await Order.create({
                userId: testUser.id,
                total: 200.00,
                createdAt: new Date('2024-01-02')
            });

            const response = await request(app)
                .get('/api/orders');

            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(2);
            // Newer order should come first
            expect(response.body[0].id).toBe(order2.id);
            expect(response.body[1].id).toBe(order1.id);
        });

        test('should only return orders for authenticated user', async () => {
            const otherUser = await User.create({
                email: 'other@example.com',
                password: 'password123'
            });

            await Order.create({
                userId: otherUser.id,
                total: 300.00
            });

            await Order.create({
                userId: testUser.id,
                total: 100.00
            });

            const response = await request(app)
                .get('/api/orders');

            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(1);
            expect(response.body[0].userId).toBe(testUser.id);
        });
    });
});
