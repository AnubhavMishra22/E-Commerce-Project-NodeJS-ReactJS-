// Unit tests for App component

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import App from '../App';
import { mockProducts, mockUser, mockOrders } from '../__mocks__/mockData';

// Mock axios
jest.mock('axios');

describe('App Component Tests', () => {
    beforeEach(() => {
        // Reset all mocks before each test
        jest.clearAllMocks();
        localStorage.clear();

        // Default axios mocks
        axios.get.mockImplementation((url) => {
            if (url === '/auth/status') {
                return Promise.reject({ response: { status: 401 } });
            }
            if (url === '/products') {
                return Promise.resolve({ data: mockProducts });
            }
            return Promise.reject(new Error('Not found'));
        });
    });

    describe('App Initialization', () => {
        test('should render app without crashing', async () => {
            render(<App />);
            await waitFor(() => {
                expect(screen.getByText(/QuantumCart/i)).toBeInTheDocument();
            });
        });

        test('should display loading state initially', () => {
            render(<App />);
            expect(screen.getByText(/Loading Store/i)).toBeInTheDocument();
        });

        test('should check auth status on mount', async () => {
            render(<App />);

            await waitFor(() => {
                expect(axios.get).toHaveBeenCalledWith('/auth/status');
            });
        });

        test('should load products on mount', async () => {
            render(<App />);

            await waitFor(() => {
                expect(axios.get).toHaveBeenCalledWith('/products');
            });
        });
    });

    describe('Header Component', () => {
        test('should render header with app name', async () => {
            render(<App />);

            await waitFor(() => {
                expect(screen.getByText(/QuantumCart/i)).toBeInTheDocument();
            });
        });

        test('should display login button when not authenticated', async () => {
            render(<App />);

            await waitFor(() => {
                expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
            });
        });

        test('should display logout button when authenticated', async () => {
            axios.get.mockImplementation((url) => {
                if (url === '/auth/status') {
                    return Promise.resolve({ data: mockUser });
                }
                if (url === '/products') {
                    return Promise.resolve({ data: mockProducts });
                }
                return Promise.reject(new Error('Not found'));
            });

            render(<App />);

            await waitFor(() => {
                expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();
            });
        });

        test('should display cart badge with item count', async () => {
            // Set cart in localStorage
            localStorage.getItem.mockReturnValue(JSON.stringify([
                { id: 1, quantity: 2 },
                { id: 2, quantity: 1 }
            ]));

            render(<App />);

            await waitFor(() => {
                expect(screen.getByText('3')).toBeInTheDocument(); // Total quantity
            });
        });
    });

    describe('Product List Component', () => {
        test('should render product list', async () => {
            render(<App />);

            await waitFor(() => {
                expect(screen.getByText('Our Products')).toBeInTheDocument();
            });
        });

        test('should display all products from API', async () => {
            render(<App />);

            await waitFor(() => {
                expect(screen.getByText('Test Product 1')).toBeInTheDocument();
                expect(screen.getByText('Test Product 2')).toBeInTheDocument();
                expect(screen.getByText('Test Product 3')).toBeInTheDocument();
            });
        });

        test('should display product prices correctly', async () => {
            render(<App />);

            await waitFor(() => {
                expect(screen.getByText('$29.99')).toBeInTheDocument();
                expect(screen.getByText('$49.99')).toBeInTheDocument();
                expect(screen.getByText('$99.99')).toBeInTheDocument();
            });
        });

        test('should display add to cart buttons', async () => {
            render(<App />);

            await waitFor(() => {
                const addButtons = screen.getAllByRole('button', { name: /Add to Cart/i });
                expect(addButtons.length).toBeGreaterThan(0);
            });
        });

        test('should add product to cart when add to cart is clicked', async () => {
            render(<App />);

            await waitFor(() => {
                const addButtons = screen.getAllByRole('button', { name: /Add to Cart/i });
                fireEvent.click(addButtons[0]);
            });

            await waitFor(() => {
                expect(screen.getByText(/added to cart/i)).toBeInTheDocument();
            });
        });

        test('should display fallback products when API fails', async () => {
            axios.get.mockImplementation((url) => {
                if (url === '/auth/status') {
                    return Promise.reject({ response: { status: 401 } });
                }
                if (url === '/products') {
                    return Promise.reject(new Error('API Error'));
                }
                return Promise.reject(new Error('Not found'));
            });

            render(<App />);

            await waitFor(() => {
                // Should still show products (fallback)
                expect(screen.getByText(/Our Products/i)).toBeInTheDocument();
            });
        });
    });

    describe('Cart Functionality', () => {
        test('should persist cart to localStorage', async () => {
            render(<App />);

            await waitFor(() => {
                const addButtons = screen.getAllByRole('button', { name: /Add to Cart/i });
                fireEvent.click(addButtons[0]);
            });

            await waitFor(() => {
                expect(localStorage.setItem).toHaveBeenCalledWith(
                    'react-store-cart',
                    expect.any(String)
                );
            });
        });

        test('should load cart from localStorage on mount', () => {
            const mockCart = [{ id: 1, name: 'Product 1', price: 29.99, quantity: 1 }];
            localStorage.getItem.mockReturnValue(JSON.stringify(mockCart));

            render(<App />);

            // Cart should be loaded from localStorage
            expect(localStorage.getItem).toHaveBeenCalledWith('react-store-cart');
        });

        test('should handle corrupted localStorage data gracefully', () => {
            localStorage.getItem.mockReturnValue('invalid json');

            // Should not throw error
            expect(() => render(<App />)).not.toThrow();
        });
    });

    describe('Navigation', () => {
        test('should navigate to cart page when cart button is clicked', async () => {
            render(<App />);

            await waitFor(() => {
                const cartButton = screen.getByRole('button', { name: /cart/i });
                fireEvent.click(cartButton);
            });

            await waitFor(() => {
                expect(screen.getByText(/Your Cart/i)).toBeInTheDocument();
            });
        });

        test('should navigate to login page when login button is clicked', async () => {
            render(<App />);

            await waitFor(() => {
                const loginButton = screen.getByRole('button', { name: /Login/i });
                fireEvent.click(loginButton);
            });

            await waitFor(() => {
                expect(screen.getByText(/Login/i)).toBeInTheDocument();
                expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
            });
        });

        test('should navigate to home when shop button is clicked', async () => {
            render(<App />);

            await waitFor(() => {
                const shopButton = screen.getByRole('button', { name: /Shop/i });
                fireEvent.click(shopButton);
            });

            await waitFor(() => {
                expect(screen.getByText(/Our Products/i)).toBeInTheDocument();
            });
        });
    });

    describe('Notification System', () => {
        test('should display notification after adding to cart', async () => {
            render(<App />);

            await waitFor(() => {
                const addButtons = screen.getAllByRole('button', { name: /Add to Cart/i });
                fireEvent.click(addButtons[0]);
            });

            await waitFor(() => {
                expect(screen.getByText(/added to cart/i)).toBeInTheDocument();
            });
        });

        test('should hide notification after timeout', async () => {
            jest.useFakeTimers();
            render(<App />);

            await waitFor(() => {
                const addButtons = screen.getAllByRole('button', { name: /Add to Cart/i });
                fireEvent.click(addButtons[0]);
            });

            await waitFor(() => {
                expect(screen.getByText(/added to cart/i)).toBeInTheDocument();
            });

            // Fast-forward time by 3 seconds
            jest.advanceTimersByTime(3000);

            await waitFor(() => {
                expect(screen.queryByText(/added to cart/i)).not.toBeInTheDocument();
            });

            jest.useRealTimers();
        });
    });
});
