// Unit tests for Product routes

const request = require('supertest');
const express = require('express');
const { sequelize } = require('../helpers/testDb');
const { mockProducts } = require('../mocks/mockData');

// Initialize models
const ProductModel = require('../../models/product.model');
const Product = ProductModel(sequelize, require('sequelize').DataTypes);

// Create express app for testing
const app = express();
app.use(express.json());

// Import product routes
const productRoutes = require('../../routes/products');
app.use('/api/products', productRoutes);

describe('Product Routes Tests', () => {
    beforeAll(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    afterEach(async () => {
        await Product.destroy({ where: {}, truncate: true });
    });

    describe('GET /api/products', () => {
        test('should return all products', async () => {
            await Product.bulkCreate(mockProducts);

            const response = await request(app)
                .get('/api/products');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body).toHaveLength(mockProducts.length);
        });

        test('should return empty array when no products exist', async () => {
            const response = await request(app)
                .get('/api/products');

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body).toHaveLength(0);
        });

        test('should return products with correct structure', async () => {
            await Product.create(mockProducts[0]);

            const response = await request(app)
                .get('/api/products');

            expect(response.status).toBe(200);
            expect(response.body[0]).toHaveProperty('id');
            expect(response.body[0]).toHaveProperty('name');
            expect(response.body[0]).toHaveProperty('price');
            expect(response.body[0]).toHaveProperty('image');
        });

        test('should return products with correct data types', async () => {
            await Product.create(mockProducts[0]);

            const response = await request(app)
                .get('/api/products');

            expect(response.status).toBe(200);
            expect(typeof response.body[0].id).toBe('number');
            expect(typeof response.body[0].name).toBe('string');
            expect(typeof response.body[0].price).toBe('string'); // Decimal comes as string
            expect(response.body[0].image).toBeTruthy();
        });

        test('should handle database errors gracefully', async () => {
            // Close database to simulate error
            await sequelize.close();

            const response = await request(app)
                .get('/api/products');

            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toContain('Error fetching products');

            // Reconnect for other tests
            await sequelize.sync({ force: true });
        });

        test('should return multiple products in correct order', async () => {
            const products = [
                { name: 'Product A', price: 10.00 },
                { name: 'Product B', price: 20.00 },
                { name: 'Product C', price: 30.00 }
            ];
            await Product.bulkCreate(products);

            const response = await request(app)
                .get('/api/products');

            expect(response.status).toBe(200);
            expect(response.body).toHaveLength(3);
            expect(response.body[0].name).toBe('Product A');
            expect(response.body[2].name).toBe('Product C');
        });
    });
});
