// PRODUCT SEEDER 
const db = require('../models');
const Product = db.Product;

const productsData = [
    { id: 1, name: 'Wireless Mouse', price: 25.99, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop&crop=center' },
    { id: 2, name: 'Mechanical Keyboard', price: 79.99, image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=400&fit=crop&crop=center' },
    { id: 3, name: '4K Monitor', price: 349.99, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop&crop=center' },
    { id: 4, name: 'Webcam with Ring Light', price: 59.99, image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=400&fit=crop&crop=center' },
    { id: 5, name: 'USB-C Hub', price: 39.99, image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop&crop=center' },
    { id: 6, name: 'Noise Cancelling Headphones', price: 199.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center' },
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