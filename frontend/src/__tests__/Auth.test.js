// Unit tests for Authentication functionality

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import App from '../App';
import { mockUser, mockProducts } from '../__mocks__/mockData';

jest.mock('axios');

describe('Authentication Tests', () => {
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

    describe('Login Page', () => {
        test('should render login form', async () => {
            render(<App />);

            await waitFor(() => {
                const loginButton = screen.getByRole('button', { name: /Login/i });
                fireEvent.click(loginButton);
            });

            await waitFor(() => {
                expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
                expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
                expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
            });
        });

        test('should toggle between login and signup', async () => {
            render(<App />);

            await waitFor(() => {
                const loginButton = screen.getByRole('button', { name: /Login/i });
                fireEvent.click(loginButton);
            });

            await waitFor(() => {
                const toggleButton = screen.getByRole('button', { name: /Don't have an account/i });
                fireEvent.click(toggleButton);
            });

            await waitFor(() => {
                expect(screen.getByRole('button', { name: /Sign Up/i })).toBeInTheDocument();
            });
        });

        test('should handle login form submission', async () => {
            axios.post.mockResolvedValue({ data: mockUser });

            render(<App />);

            await waitFor(() => {
                const loginButton = screen.getByRole('button', { name: /Login/i });
                fireEvent.click(loginButton);
            });

            await waitFor(() => {
                const emailInput = screen.getByLabelText(/Email/i);
                const passwordInput = screen.getByLabelText(/Password/i);

                fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
                fireEvent.change(passwordInput, { target: { value: 'password123' } });

                const signInButton = screen.getByRole('button', { name: /Sign In/i });
                fireEvent.click(signInButton);
            });

            await waitFor(() => {
                expect(axios.post).toHaveBeenCalledWith('/auth/login', {
                    email: 'test@example.com',
                    password: 'password123'
                });
            });
        });

        test('should display success message on successful login', async () => {
            axios.post.mockResolvedValue({ data: mockUser });

            render(<App />);

            await waitFor(() => {
                const loginButton = screen.getByRole('button', { name: /Login/i });
                fireEvent.click(loginButton);
            });

            await waitFor(() => {
                const emailInput = screen.getByLabelText(/Email/i);
                const passwordInput = screen.getByLabelText(/Password/i);

                fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
                fireEvent.change(passwordInput, { target: { value: 'password123' } });

                const signInButton = screen.getByRole('button', { name: /Sign In/i });
                fireEvent.click(signInButton);
            });

            await waitFor(() => {
                expect(screen.getByText(/Logged in successfully/i)).toBeInTheDocument();
            });
        });

        test('should display error message on failed login', async () => {
            axios.post.mockRejectedValue({
                response: { data: { message: 'Incorrect email or password' } }
            });

            render(<App />);

            await waitFor(() => {
                const loginButton = screen.getByRole('button', { name: /Login/i });
                fireEvent.click(loginButton);
            });

            await waitFor(() => {
                const emailInput = screen.getByLabelText(/Email/i);
                const passwordInput = screen.getByLabelText(/Password/i);

                fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
                fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });

                const signInButton = screen.getByRole('button', { name: /Sign In/i });
                fireEvent.click(signInButton);
            });

            await waitFor(() => {
                expect(screen.getByText(/Incorrect email or password/i)).toBeInTheDocument();
            });
        });

        test('should navigate to home after successful login', async () => {
            axios.post.mockResolvedValue({ data: mockUser });

            render(<App />);

            await waitFor(() => {
                const loginButton = screen.getByRole('button', { name: /Login/i });
                fireEvent.click(loginButton);
            });

            await waitFor(() => {
                const emailInput = screen.getByLabelText(/Email/i);
                const passwordInput = screen.getByLabelText(/Password/i);

                fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
                fireEvent.change(passwordInput, { target: { value: 'password123' } });

                const signInButton = screen.getByRole('button', { name: /Sign In/i });
                fireEvent.click(signInButton);
            });

            await waitFor(() => {
                expect(screen.getByText(/Our Products/i)).toBeInTheDocument();
            });
        });
    });

    describe('Registration', () => {
        test('should handle registration form submission', async () => {
            axios.post.mockResolvedValue({ data: mockUser });

            render(<App />);

            await waitFor(() => {
                const loginButton = screen.getByRole('button', { name: /Login/i });
                fireEvent.click(loginButton);
            });

            await waitFor(() => {
                const toggleButton = screen.getByRole('button', { name: /Don't have an account/i });
                fireEvent.click(toggleButton);
            });

            await waitFor(() => {
                const emailInput = screen.getByLabelText(/Email/i);
                const passwordInput = screen.getByLabelText(/Password/i);

                fireEvent.change(emailInput, { target: { value: 'newuser@example.com' } });
                fireEvent.change(passwordInput, { target: { value: 'password123' } });

                const signUpButton = screen.getByRole('button', { name: /Sign Up/i });
                fireEvent.click(signUpButton);
            });

            await waitFor(() => {
                expect(axios.post).toHaveBeenCalledWith('/auth/register', {
                    email: 'newuser@example.com',
                    password: 'password123'
                });
            });
        });

        test('should display success message on successful registration', async () => {
            axios.post.mockResolvedValue({ data: mockUser });

            render(<App />);

            await waitFor(() => {
                const loginButton = screen.getByRole('button', { name: /Login/i });
                fireEvent.click(loginButton);
            });

            await waitFor(() => {
                const toggleButton = screen.getByRole('button', { name: /Don't have an account/i });
                fireEvent.click(toggleButton);
            });

            await waitFor(() => {
                const emailInput = screen.getByLabelText(/Email/i);
                const passwordInput = screen.getByLabelText(/Password/i);

                fireEvent.change(emailInput, { target: { value: 'newuser@example.com' } });
                fireEvent.change(passwordInput, { target: { value: 'password123' } });

                const signUpButton = screen.getByRole('button', { name: /Sign Up/i });
                fireEvent.click(signUpButton);
            });

            await waitFor(() => {
                expect(screen.getByText(/Account created successfully/i)).toBeInTheDocument();
            });
        });

        test('should display error when registration fails', async () => {
            axios.post.mockRejectedValue({
                response: { data: { message: 'User already exists' } }
            });

            render(<App />);

            await waitFor(() => {
                const loginButton = screen.getByRole('button', { name: /Login/i });
                fireEvent.click(loginButton);
            });

            await waitFor(() => {
                const toggleButton = screen.getByRole('button', { name: /Don't have an account/i });
                fireEvent.click(toggleButton);
            });

            await waitFor(() => {
                const emailInput = screen.getByLabelText(/Email/i);
                const passwordInput = screen.getByLabelText(/Password/i);

                fireEvent.change(emailInput, { target: { value: 'existing@example.com' } });
                fireEvent.change(passwordInput, { target: { value: 'password123' } });

                const signUpButton = screen.getByRole('button', { name: /Sign Up/i });
                fireEvent.click(signUpButton);
            });

            await waitFor(() => {
                expect(screen.getByText(/User already exists/i)).toBeInTheDocument();
            });
        });
    });

    describe('Logout', () => {
        test('should handle logout', async () => {
            axios.get.mockImplementation((url) => {
                if (url === '/auth/status') {
                    return Promise.resolve({ data: mockUser });
                }
                if (url === '/products') {
                    return Promise.resolve({ data: mockProducts });
                }
                return Promise.reject(new Error('Not found'));
            });

            axios.post.mockResolvedValue({ data: { message: 'Logged out successfully' } });

            render(<App />);

            await waitFor(() => {
                expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();
            });

            await waitFor(() => {
                const logoutButton = screen.getByRole('button', { name: /Logout/i });
                fireEvent.click(logoutButton);
            });

            await waitFor(() => {
                expect(axios.post).toHaveBeenCalledWith('/auth/logout');
            });
        });

        test('should display success message on logout', async () => {
            axios.get.mockImplementation((url) => {
                if (url === '/auth/status') {
                    return Promise.resolve({ data: mockUser });
                }
                if (url === '/products') {
                    return Promise.resolve({ data: mockProducts });
                }
                return Promise.reject(new Error('Not found'));
            });

            axios.post.mockResolvedValue({ data: { message: 'Logged out successfully' } });

            render(<App />);

            await waitFor(() => {
                const logoutButton = screen.getByRole('button', { name: /Logout/i });
                fireEvent.click(logoutButton);
            });

            await waitFor(() => {
                expect(screen.getByText(/You have been logged out/i)).toBeInTheDocument();
            });
        });

        test('should clear cart on logout', async () => {
            axios.get.mockImplementation((url) => {
                if (url === '/auth/status') {
                    return Promise.resolve({ data: mockUser });
                }
                if (url === '/products') {
                    return Promise.resolve({ data: mockProducts });
                }
                return Promise.reject(new Error('Not found'));
            });

            axios.post.mockResolvedValue({ data: { message: 'Logged out successfully' } });

            // Set cart in localStorage
            localStorage.getItem.mockReturnValue(JSON.stringify([
                { id: 1, quantity: 2 }
            ]));

            render(<App />);

            await waitFor(() => {
                const logoutButton = screen.getByRole('button', { name: /Logout/i });
                fireEvent.click(logoutButton);
            });

            await waitFor(() => {
                // Cart should be cleared
                const cartBadge = screen.queryByText('2');
                expect(cartBadge).not.toBeInTheDocument();
            });
        });
    });

    describe('Protected Routes', () => {
        test('should hide My Orders button when not authenticated', async () => {
            render(<App />);

            await waitFor(() => {
                expect(screen.queryByRole('button', { name: /My Orders/i })).not.toBeInTheDocument();
            });
        });

        test('should show My Orders button when authenticated', async () => {
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
                expect(screen.getByRole('button', { name: /My Orders/i })).toBeInTheDocument();
            });
        });
    });
});
