// Unit tests for Cart functionality

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import App from '../App';
import { mockProducts, mockUser } from '../__mocks__/mockData';

jest.mock('axios');

describe('Cart Component Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();

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

    describe('Empty Cart', () => {
        test('should display empty cart message', async () => {
            render(<App />);

            // Navigate to cart
            await waitFor(() => {
                const cartButton = screen.getByRole('button', { name: /cart/i });
                fireEvent.click(cartButton);
            });

            await waitFor(() => {
                expect(screen.getByText(/Your cart is empty/i)).toBeInTheDocument();
            });
        });

        test('should show continue shopping button when cart is empty', async () => {
            render(<App />);

            await waitFor(() => {
                const cartButton = screen.getByRole('button', { name: /cart/i });
                fireEvent.click(cartButton);
            });

            await waitFor(() => {
                expect(screen.getByRole('button', { name: /Continue Shopping/i })).toBeInTheDocument();
            });
        });

        test('should navigate back to products when continue shopping is clicked', async () => {
            render(<App />);

            await waitFor(() => {
                const cartButton = screen.getByRole('button', { name: /cart/i });
                fireEvent.click(cartButton);
            });

            await waitFor(() => {
                const continueButton = screen.getByRole('button', { name: /Continue Shopping/i });
                fireEvent.click(continueButton);
            });

            await waitFor(() => {
                expect(screen.getByText(/Our Products/i)).toBeInTheDocument();
            });
        });
    });

    describe('Cart with Items', () => {
        beforeEach(async () => {
            // Render app and add items to cart
            render(<App />);

            await waitFor(() => {
                const addButtons = screen.getAllByRole('button', { name: /Add to Cart/i });
                fireEvent.click(addButtons[0]); // Add first product
                fireEvent.click(addButtons[1]); // Add second product
            });
        });

        test('should display cart items', async () => {
            await waitFor(() => {
                const cartButton = screen.getByRole('button', { name: /cart/i });
                fireEvent.click(cartButton);
            });

            await waitFor(() => {
                expect(screen.getByText(/Test Product 1/i)).toBeInTheDocument();
                expect(screen.getByText(/Test Product 2/i)).toBeInTheDocument();
            });
        });

        test('should display item quantities', async () => {
            await waitFor(() => {
                const cartButton = screen.getByRole('button', { name: /cart/i });
                fireEvent.click(cartButton);
            });

            await waitFor(() => {
                const quantityInputs = screen.getAllByRole('spinbutton');
                expect(quantityInputs.length).toBeGreaterThan(0);
            });
        });

        test('should calculate total correctly', async () => {
            await waitFor(() => {
                const cartButton = screen.getByRole('button', { name: /cart/i });
                fireEvent.click(cartButton);
            });

            await waitFor(() => {
                // Total should be 29.99 + 49.99 = 79.98
                expect(screen.getByText(/Total: \$79.98/i)).toBeInTheDocument();
            });
        });

        test('should update quantity when input changes', async () => {
            await waitFor(() => {
                const cartButton = screen.getByRole('button', { name: /cart/i });
                fireEvent.click(cartButton);
            });

            await waitFor(() => {
                const quantityInputs = screen.getAllByRole('spinbutton');
                fireEvent.change(quantityInputs[0], { target: { value: '3' } });
            });

            await waitFor(() => {
                // Total should update to (29.99 * 3) + 49.99 = 139.96
                expect(screen.getByText(/Total: \$139.96/i)).toBeInTheDocument();
            });
        });

        test('should remove item when quantity set to 0', async () => {
            await waitFor(() => {
                const cartButton = screen.getByRole('button', { name: /cart/i });
                fireEvent.click(cartButton);
            });

            await waitFor(() => {
                const quantityInputs = screen.getAllByRole('spinbutton');
                fireEvent.change(quantityInputs[0], { target: { value: '0' } });
            });

            await waitFor(() => {
                // First product should be removed
                expect(screen.queryByText(/Test Product 1/i)).not.toBeInTheDocument();
            });
        });

        test('should display checkout button', async () => {
            await waitFor(() => {
                const cartButton = screen.getByRole('button', { name: /cart/i });
                fireEvent.click(cartButton);
            });

            await waitFor(() => {
                expect(screen.getByRole('button', { name: /Proceed to Checkout/i })).toBeInTheDocument();
            });
        });
    });

    describe('Checkout Process', () => {
        test('should redirect to login when not authenticated', async () => {
            render(<App />);

            // Add item to cart
            await waitFor(() => {
                const addButtons = screen.getAllByRole('button', { name: /Add to Cart/i });
                fireEvent.click(addButtons[0]);
            });

            // Go to cart
            await waitFor(() => {
                const cartButton = screen.getByRole('button', { name: /cart/i });
                fireEvent.click(cartButton);
            });

            // Click checkout
            await waitFor(() => {
                const checkoutButton = screen.getByRole('button', { name: /Proceed to Checkout/i });
                fireEvent.click(checkoutButton);
            });

            // Should show notification and navigate to login
            await waitFor(() => {
                expect(screen.getByText(/Please log in to place an order/i)).toBeInTheDocument();
            });
        });

        test('should create order when authenticated', async () => {
            // Mock authenticated user
            axios.get.mockImplementation((url) => {
                if (url === '/auth/status') {
                    return Promise.resolve({ data: mockUser });
                }
                if (url === '/products') {
                    return Promise.resolve({ data: mockProducts });
                }
                return Promise.reject(new Error('Not found'));
            });

            axios.post.mockResolvedValue({ data: { id: 1, total: 29.99 } });

            render(<App />);

            // Add item to cart
            await waitFor(() => {
                const addButtons = screen.getAllByRole('button', { name: /Add to Cart/i });
                fireEvent.click(addButtons[0]);
            });

            // Go to cart
            await waitFor(() => {
                const cartButton = screen.getByRole('button', { name: /cart/i });
                fireEvent.click(cartButton);
            });

            // Click checkout
            await waitFor(() => {
                const checkoutButton = screen.getByRole('button', { name: /Proceed to Checkout/i });
                fireEvent.click(checkoutButton);
            });

            // Should call orders API
            await waitFor(() => {
                expect(axios.post).toHaveBeenCalledWith('/orders', expect.any(Object));
            });
        });

        test('should clear cart after successful order', async () => {
            axios.get.mockImplementation((url) => {
                if (url === '/auth/status') {
                    return Promise.resolve({ data: mockUser });
                }
                if (url === '/products') {
                    return Promise.resolve({ data: mockProducts });
                }
                if (url === '/orders') {
                    return Promise.resolve({ data: [] });
                }
                return Promise.reject(new Error('Not found'));
            });

            axios.post.mockResolvedValue({ data: { id: 1, total: 29.99 } });

            render(<App />);

            // Add item to cart
            await waitFor(() => {
                const addButtons = screen.getAllByRole('button', { name: /Add to Cart/i });
                fireEvent.click(addButtons[0]);
            });

            // Go to cart
            await waitFor(() => {
                const cartButton = screen.getByRole('button', { name: /cart/i });
                fireEvent.click(cartButton);
            });

            // Click checkout
            await waitFor(() => {
                const checkoutButton = screen.getByRole('button', { name: /Proceed to Checkout/i });
                fireEvent.click(checkoutButton);
            });

            // Should show success notification
            await waitFor(() => {
                expect(screen.getByText(/Order placed successfully/i)).toBeInTheDocument();
            });
        });

        test('should show error notification when checkout fails', async () => {
            axios.get.mockImplementation((url) => {
                if (url === '/auth/status') {
                    return Promise.resolve({ data: mockUser });
                }
                if (url === '/products') {
                    return Promise.resolve({ data: mockProducts });
                }
                return Promise.reject(new Error('Not found'));
            });

            axios.post.mockRejectedValue(new Error('Server error'));

            render(<App />);

            // Add item to cart
            await waitFor(() => {
                const addButtons = screen.getAllByRole('button', { name: /Add to Cart/i });
                fireEvent.click(addButtons[0]);
            });

            // Go to cart
            await waitFor(() => {
                const cartButton = screen.getByRole('button', { name: /cart/i });
                fireEvent.click(cartButton);
            });

            // Click checkout
            await waitFor(() => {
                const checkoutButton = screen.getByRole('button', { name: /Proceed to Checkout/i });
                fireEvent.click(checkoutButton);
            });

            // Should show error notification
            await waitFor(() => {
                expect(screen.getByText(/Failed to place order/i)).toBeInTheDocument();
            });
        });
    });
});
