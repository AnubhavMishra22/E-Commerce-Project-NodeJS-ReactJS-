// Mock data for testing

const mockUsers = [
    {
        id: 1,
        email: 'testuser1@example.com',
        password: 'password123'
    },
    {
        id: 2,
        email: 'testuser2@example.com',
        password: 'password456'
    }
];

const mockProducts = [
    {
        id: 1,
        name: 'Test Product 1',
        price: 29.99,
        image: 'https://example.com/product1.jpg'
    },
    {
        id: 2,
        name: 'Test Product 2',
        price: 49.99,
        image: 'https://example.com/product2.jpg'
    },
    {
        id: 3,
        name: 'Test Product 3',
        price: 99.99,
        image: 'https://example.com/product3.jpg'
    }
];

const mockOrders = [
    {
        id: 1,
        userId: 1,
        total: 79.98,
        createdAt: new Date('2024-01-15')
    },
    {
        id: 2,
        userId: 1,
        total: 149.97,
        createdAt: new Date('2024-01-20')
    }
];

const mockOrderItems = [
    {
        id: 1,
        orderId: 1,
        productId: 1,
        quantity: 2,
        price: 29.99
    },
    {
        id: 2,
        orderId: 1,
        productId: 2,
        quantity: 1,
        price: 49.99
    }
];

const mockCart = [
    {
        id: 1,
        name: 'Test Product 1',
        price: 29.99,
        quantity: 2,
        image: 'https://example.com/product1.jpg'
    },
    {
        id: 2,
        name: 'Test Product 2',
        price: 49.99,
        quantity: 1,
        image: 'https://example.com/product2.jpg'
    }
];

module.exports = {
    mockUsers,
    mockProducts,
    mockOrders,
    mockOrderItems,
    mockCart
};
