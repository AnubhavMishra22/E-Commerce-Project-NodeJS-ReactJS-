// Unit tests for Product model

const { sequelize } = require('../helpers/testDb');
const ProductModel = require('../../models/product.model');
const { mockProducts } = require('../mocks/mockData');

// Initialize Product model with test database
const Product = ProductModel(sequelize, require('sequelize').DataTypes);

describe('Product Model Tests', () => {
    beforeAll(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    afterEach(async () => {
        await Product.destroy({ where: {}, truncate: true });
    });

    describe('Product Creation', () => {
        test('should create a new product with valid data', async () => {
            const productData = mockProducts[0];
            const product = await Product.create(productData);

            expect(product).toBeDefined();
            expect(product.id).toBeDefined();
            expect(product.name).toBe(productData.name);
            expect(parseFloat(product.price)).toBe(productData.price);
            expect(product.image).toBe(productData.image);
        });

        test('should create product with only required fields', async () => {
            const productData = {
                name: 'Minimal Product',
                price: 19.99
            };

            const product = await Product.create(productData);

            expect(product).toBeDefined();
            expect(product.name).toBe(productData.name);
            expect(parseFloat(product.price)).toBe(productData.price);
        });

        test('should fail to create product without name', async () => {
            const productData = {
                price: 29.99,
                image: 'https://example.com/image.jpg'
            };

            await expect(Product.create(productData)).rejects.toThrow();
        });

        test('should fail to create product without price', async () => {
            const productData = {
                name: 'Test Product',
                image: 'https://example.com/image.jpg'
            };

            await expect(Product.create(productData)).rejects.toThrow();
        });

        test('should handle decimal prices correctly', async () => {
            const productData = {
                name: 'Decimal Price Product',
                price: 99.99
            };

            const product = await Product.create(productData);

            expect(parseFloat(product.price)).toBe(99.99);
        });
    });

    describe('Product Retrieval', () => {
        test('should find all products', async () => {
            await Product.bulkCreate(mockProducts);
            const products = await Product.findAll();

            expect(products).toHaveLength(mockProducts.length);
        });

        test('should find product by id', async () => {
            const created = await Product.create(mockProducts[0]);
            const product = await Product.findByPk(created.id);

            expect(product).toBeDefined();
            expect(product.name).toBe(mockProducts[0].name);
        });

        test('should return empty array when no products exist', async () => {
            const products = await Product.findAll();

            expect(products).toHaveLength(0);
        });
    });

    describe('Product Update', () => {
        test('should update product name', async () => {
            const product = await Product.create(mockProducts[0]);
            await product.update({ name: 'Updated Product Name' });

            expect(product.name).toBe('Updated Product Name');
        });

        test('should update product price', async () => {
            const product = await Product.create(mockProducts[0]);
            await product.update({ price: 149.99 });

            expect(parseFloat(product.price)).toBe(149.99);
        });

        test('should update product image', async () => {
            const product = await Product.create(mockProducts[0]);
            const newImage = 'https://example.com/new-image.jpg';
            await product.update({ image: newImage });

            expect(product.image).toBe(newImage);
        });
    });

    describe('Product Deletion', () => {
        test('should delete a product', async () => {
            const product = await Product.create(mockProducts[0]);
            await product.destroy();

            const found = await Product.findByPk(product.id);
            expect(found).toBeNull();
        });

        test('should delete multiple products', async () => {
            await Product.bulkCreate(mockProducts);
            await Product.destroy({ where: {} });

            const products = await Product.findAll();
            expect(products).toHaveLength(0);
        });
    });
});
