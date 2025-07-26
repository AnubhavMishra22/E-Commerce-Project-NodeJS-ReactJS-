import React, { useState, useEffect, createContext, useContext } from 'react';
// Removed axios as we are now using a mock API inside this file.

// =================================================================
// >> MOCK BACKEND API <<
// In a real application, these functions would make HTTP requests (e.g., with axios)
// to a running Node.js server. Here, we simulate the server's logic and database
// to make the frontend fully functional for demonstration purposes.
// =================================================================

const mockDatabase = {
    // We'll start with one user for demonstration. Pass: password123
    users: [{ id: 1, email: 'user@example.com', password: 'password123' }], 
    products: [
        { id: 1, name: 'Wireless Mouse', price: 25.99, image: 'https://placehold.co/400x400/3498db/ffffff?text=Mouse' },
        { id: 2, name: 'Mechanical Keyboard', price: 79.99, image: 'https://placehold.co/400x400/2ecc71/ffffff?text=Keyboard' },
        { id: 3, name: '4K Monitor', price: 349.99, image: 'https://placehold.co/400x400/9b59b6/ffffff?text=Monitor' },
        { id: 4, name: 'Webcam with Ring Light', price: 59.99, image: 'https://placehold.co/400x400/f1c40f/ffffff?text=Webcam' },
        { id: 5, name: 'USB-C Hub', price: 39.99, image: 'https://placehold.co/400x400/e74c3c/ffffff?text=Hub' },
        { id: 6, name: 'Noise Cancelling Headphones', price: 199.99, image: 'https://placehold.co/400x400/1abc9c/ffffff?text=Headphones' },
    ],
    orders: [],
};

// This simulates the session state on the server
let loggedInUser = null;

const mockApi = {
    get: (endpoint) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log(`MOCK GET: ${endpoint}`);
                if (endpoint === '/products') {
                    resolve({ data: mockDatabase.products });
                } else if (endpoint === '/auth/status') {
                    if (loggedInUser) {
                        resolve({ data: loggedInUser });
                    } else {
                        reject({ response: { status: 401, data: { message: 'Not authenticated' } } });
                    }
                } else if (endpoint === '/orders') {
                    if (!loggedInUser) return reject({ response: { status: 401, data: { message: 'Not authenticated' } } });
                    const userOrders = mockDatabase.orders.filter(o => o.userId === loggedInUser.id);
                    resolve({ data: userOrders });
                } else {
                    reject({ response: { status: 404, data: { message: 'Not Found' } } });
                }
            }, 500); // Simulate network delay
        });
    },
    post: (endpoint, body) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log(`MOCK POST: ${endpoint}`, body);
                if (endpoint === '/auth/register') {
                    const { email, password } = body;
                    if (mockDatabase.users.find(u => u.email === email)) {
                        return reject({ response: { data: { message: 'User with that email already exists.' } } });
                    }
                    const newUser = { id: Date.now(), email, password };
                    mockDatabase.users.push(newUser);
                    loggedInUser = { id: newUser.id, email: newUser.email };
                    return resolve({ data: loggedInUser });
                }
                if (endpoint === '/auth/login') {
                    const { email, password } = body;
                    const user = mockDatabase.users.find(u => u.email === email && u.password === password);
                    if (user) {
                        loggedInUser = { id: user.id, email: user.email };
                        return resolve({ data: loggedInUser });
                    }
                    return reject({ response: { data: { message: 'Incorrect email or password.' } } });
                }
                if (endpoint === '/auth/logout') {
                    loggedInUser = null;
                    return resolve({ data: { message: 'Logged out successfully.' } });
                }
                if (endpoint === '/orders') {
                     if (!loggedInUser) return reject({ response: { status: 401, data: { message: 'Not authenticated' } } });
                    const { cart } = body;
                    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
                    const newOrder = {
                        id: Date.now(),
                        userId: loggedInUser.id,
                        createdAt: new Date().toISOString(),
                        total,
                        // In a real DB, this would be a join. We simulate it here.
                        orderItems: cart.map(item => ({
                            id: Date.now() + item.id,
                            quantity: item.quantity,
                            price: item.price,
                            product: { name: item.name }
                        }))
                    };
                    mockDatabase.orders.push(newOrder);
                    return resolve({ data: newOrder });
                }
                reject({ response: { status: 404, data: { message: 'Not Found' } } });
            }, 500); // Simulate network delay
        });
    }
};
// --- End of Mock Backend ---

const AuthContext = createContext(null);
const CartContext = createContext(null);

export default function App() {
    const [user, setUser] = useState(null);
    const [cart, setCart] = useState(() => {
        try {
            const localData = localStorage.getItem('react-store-cart');
            return localData ? JSON.parse(localData) : [];
        } catch (error) {
            return [];
        }
    });
    const [page, setPage] = useState('home');
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState({ message: '', type: '' });

    useEffect(() => {
        localStorage.setItem('react-store-cart', JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await mockApi.get('/auth/status');
                setUser(response.data);
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkAuthStatus();
    }, []);

    const addToCart = (product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
        showNotification(`${product.name} added to cart!`, 'success');
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity <= 0) {
            setCart(prevCart => prevCart.filter(item => item.id !== productId));
        } else {
            setCart(prevCart => prevCart.map(item =>
                item.id === productId ? { ...item, quantity: newQuantity } : item
            ));
        }
    };

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: '', type: '' }), 3000);
    };

    const handleLogout = async () => {
        try {
            await mockApi.post('/auth/logout');
            setUser(null);
            setCart([]);
            setPage('home');
            showNotification('You have been logged out.', 'success');
        } catch (error) {
            showNotification('Logout failed. Please try again.', 'error');
        }
    };

    const navigate = (targetPage) => {
        if (targetPage === 'login' && user) {
            handleLogout();
        } else {
            setPage(targetPage);
        }
    };

    const cartContextValue = { cart, addToCart, updateQuantity, setCart, showNotification };
    const authContextValue = { user, setUser };

    if (loading) {
        return <div className="flex items-center justify-center h-screen bg-gray-100"><div className="text-xl font-semibold">Loading Store...</div></div>;
    }

    return (
        <AuthContext.Provider value={authContextValue}>
            <CartContext.Provider value={cartContextValue}>
                <div className="bg-gray-50 min-h-screen font-sans">
                    <Header navigate={navigate} />
                    <Notification notification={notification} />
                    <main className="p-4 sm:p-6 md:p-8">
                        {page === 'home' && <ProductList />}
                        {page === 'cart' && <CartPage navigate={navigate} />}
                        {page === 'orders' && <OrderHistoryPage />}
                        {page === 'login' && <LoginPage navigate={navigate} />}
                    </main>
                    <Footer />
                </div>
            </CartContext.Provider>
        </AuthContext.Provider>
    );
}

function Header({ navigate }) {
    const { user } = useContext(AuthContext);
    const { cart } = useContext(CartContext);
    const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <header className="bg-white shadow-md sticky top-0 z-10">
            <nav className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
                <div className="text-2xl font-bold text-gray-800 cursor-pointer" onClick={() => navigate('home')}>
                    ReactStore
                </div>
                <div className="flex items-center space-x-4">
                    <button onClick={() => navigate('home')} className="text-gray-600 hover:text-blue-600 transition">Shop</button>
                    {user && <button onClick={() => navigate('orders')} className="text-gray-600 hover:text-blue-600 transition">My Orders</button>}
                    <button onClick={() => navigate('cart')} className="relative text-gray-600 hover:text-blue-600 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        {cartItemCount > 0 && <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{cartItemCount}</span>}
                    </button>
                    <button onClick={() => navigate('login')} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition font-semibold">
                        {user ? 'Logout' : 'Login'}
                    </button>
                </div>
            </nav>
        </header>
    );
}

function ProductList() {
    const { addToCart } = useContext(CartContext);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await mockApi.get('/products');
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading) {
        return <div className="text-center py-12">Loading products...</div>;
    }

    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Our Products</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {products.map(product => (
                    <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
                        <img src={product.image} alt={product.name} className="w-full h-56 object-cover" />
                        <div className="p-6">
                            <h2 className="text-xl font-bold text-gray-800">{product.name}</h2>
                            <p className="text-gray-600 mt-2">${parseFloat(product.price).toFixed(2)}</p>
                            <button onClick={() => addToCart(product)} className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition font-semibold">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function CartPage({ navigate }) {
    const { cart, updateQuantity, setCart, showNotification } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleCheckout = async () => {
        if (!user) {
            showNotification('Please log in to place an order.', 'error');
            navigate('login');
            return;
        }
        if (cart.length === 0) {
            showNotification('Your cart is empty.', 'error');
            return;
        }
        try {
            await mockApi.post('/orders', { cart });
            showNotification('Order placed successfully!', 'success');
            setCart([]);
            navigate('orders');
        } catch (error) {
            console.error("Error placing order: ", error);
            showNotification('Failed to place order. Please try again.', 'error');
        }
    };

    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Cart</h1>
            {cart.length === 0 ? (
                 <div className="text-center py-12 bg-white rounded-lg shadow-md">
                    <p className="text-gray-600 text-xl">Your cart is empty.</p>
                     <button onClick={() => navigate('home')} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition font-semibold">
                        Continue Shopping
                    </button>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-md p-6">
                    {cart.map(item => (
                        <div key={item.id} className="flex items-center justify-between border-b py-4">
                            <div className="flex items-center">
                                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md mr-4" />
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-800">{item.name}</h2>
                                    <p className="text-gray-600">${parseFloat(item.price).toFixed(2)}</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                    className="w-16 text-center border rounded-md mx-4"
                                    min="0"
                                />
                                <p className="font-semibold w-24 text-right">${(item.price * item.quantity).toFixed(2)}</p>
                                <button onClick={() => updateQuantity(item.id, 0)} className="ml-4 text-red-500 hover:text-red-700">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </div>
                        </div>
                    ))}
                    <div className="mt-6 text-right">
                        <h2 className="text-2xl font-bold">Total: ${total.toFixed(2)}</h2>
                        <button onClick={handleCheckout} className="mt-4 bg-green-600 text-white px-8 py-3 rounded-md hover:bg-green-700 transition font-bold text-lg">
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

function OrderHistoryPage() {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) {
                setLoading(false);
                return;
            };
            try {
                const response = await mockApi.get('/orders');
                setOrders(response.data);
            } catch (error) {
                console.error("Error fetching orders: ", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [user]);

    if (loading) {
        return <div className="text-center py-12"><p>Loading order history...</p></div>;
    }

    if (!user) {
        return <div className="text-center py-12 bg-white rounded-lg shadow-md"><p className="text-gray-600 text-xl">Please log in to see your orders.</p></div>;
    }

    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Order History</h1>
            {orders.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-md">
                    <p className="text-gray-600 text-xl">You haven't placed any orders yet.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map(order => (
                        <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex justify-between items-center border-b pb-3 mb-3">
                                <div>
                                    <p className="font-bold text-lg">Order ID: {order.id}</p>
                                    <p className="text-sm text-gray-500">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                                <p className="font-bold text-xl text-blue-600">Total: ${parseFloat(order.total).toFixed(2)}</p>
                            </div>
                            <div>
                               <h3 className="font-semibold mb-2">Items:</h3>
                                {order.orderItems.map(item => (
                                    <div key={item.id} className="flex items-center justify-between py-2 pl-4">
                                        <p>{item.product.name} (x{item.quantity})</p>
                                        <p>${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function LoginPage({ navigate }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState('');
    const { setUser } = useContext(AuthContext);
    const { showNotification } = useContext(CartContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const endpoint = isSignUp ? '/auth/register' : '/auth/login';
        try {
            const response = await mockApi.post(endpoint, { email, password });
            setUser(response.data);
            const message = isSignUp ? 'Account created successfully!' : 'Logged in successfully!';
            showNotification(message, 'success');
            navigate('home');
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'An error occurred. Please try again.';
            setError(errorMessage);
            showNotification(errorMessage, 'error');
        }
    };

    return (
        <div className="flex justify-center items-center py-12">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">{isSignUp ? 'Create Account' : 'Login'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            {isSignUp ? 'Sign Up' : 'Sign In'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                        >
                            {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function Notification({ notification }) {
    if (!notification.message) return null;
    const bgColor = notification.type === 'error' ? 'bg-red-500' : 'bg-green-500';
    return (
        <div className={`fixed top-20 right-5 text-white py-2 px-4 rounded-lg shadow-lg animate-fade-in-out ${bgColor}`}>
            {notification.message}
        </div>
    );
}

function Footer() {
    return (
        <footer className="bg-white mt-12 py-6 border-t">
            <div className="container mx-auto text-center text-gray-600">
                <p>&copy; {new Date().getFullYear()} ReactStore. All rights reserved.</p>
                <p className="text-sm">A Online Shopping E-Commerce App using React with a Mock Backend</p>
            </div>
        </footer>
    );
}

const style = document.createElement('style');
style.textContent = `
  @keyframes fade-in-out {
    0% { opacity: 0; transform: translateY(-20px); }
    10% { opacity: 1; transform: translateY(0); }
    90% { opacity: 1; transform: translateY(0); }
    100% { opacity: 0; transform: translateY(-20px); }
  }
  .animate-fade-in-out {
    animation: fade-in-out 3s ease-in-out forwards;
  }
`;
document.head.append(style);
