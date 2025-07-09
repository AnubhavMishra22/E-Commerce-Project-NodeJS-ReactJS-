// =================================================================
// >> PRODUCT SEEDER (seeders/seedProducts.js)
// Optional: To populate the products table with initial data.
// =================================================================
const db = require('../models');
const Product = db.Product;

const productsData = [
    { id: 1, name: 'Wireless Mouse', price: 25.99, image: 'https://placehold.co/400x400/3498db/ffffff?text=Mouse' },
    { id: 2, name: 'Mechanical Keyboard', price: 79.99, image: 'https://placehold.co/400x400/2ecc71/ffffff?text=Keyboard' },
    { id: 3, name: '4K Monitor', price: 349.99, image: 'https://placehold.co/400x400/9b59b6/ffffff?text=Monitor' },
    { id: 4, name: 'Webcam with Ring Light', price: 59.99, image: 'https://placehold.co/400x400/f1c40f/ffffff?text=Webcam' },
    { id: 5, name: 'USB-C Hub', price: 39.99, image: 'https://placehold.co/400x400/e74c3c/ffffff?text=Hub' },
    { id: 6, name: 'Noise Cancelling Headphones', price: 199.99, image: 'https://placehold.co/400x400/1abc9c/ffffff?text=Headphones' },
];

async function seedProducts() {
    try {
        const count = await Product.count();
        if (count > 0) {
            console.log('Products table already seeded.');
            return;
        }
        await Product.bulkCreate(productsData);
        console.log('Products seeded successfully.');
    } catch (error) {
        console.error('Error seeding products:', error);
    }
}

module.exports = seedProducts;