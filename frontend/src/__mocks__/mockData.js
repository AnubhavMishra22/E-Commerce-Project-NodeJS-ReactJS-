// Mock data for frontend testing

export const mockProducts = [
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

export const mockUser = {
    id: 1,
    email: 'testuser@example.com'
};

export const mockCart = [
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

export const mockOrders = [
    {
        id: 1,
        total: 129.97,
        createdAt: '2024-01-15T10:00:00.000Z',
        orderItems: [
            {
                id: 1,
                quantity: 2,
                price: 29.99,
                product: {
                    id: 1,
                    name: 'Test Product 1'
                }
            },
            {
                id: 2,
                quantity: 1,
                price: 49.99,
                product: {
                    id: 2,
                    name: 'Test Product 2'
                }
            }
        ]
    }
];
