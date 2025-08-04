// main entry point for our application.
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const db = require('./models'); // Imports the Sequelize instance and models
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
require('./config/passport'); // Configures the Passport.js strategy

const app = express();
const PORT = process.env.PORT || 8080;

// --- Middleware ---

// CORS: Allows the React frontend (running on a different port) to communicate with this backend.
app.use(cors({
    origin: 'http://localhost:3000', // URL of the React app
    credentials: true // Allows cookies to be sent from the frontend
}));

// Body Parsers: To parse incoming JSON and URL-encoded request bodies.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session Management: Configures session handling.
// The session data will be stored in the MySQL database using 'connect-session-sequelize'.
const sessionStore = new SequelizeStore({
    db: db.sequelize,
});

app.use(session({
    secret: 'secret_key_for_sessions', // IMPORTANT: Change this and use an environment variable in production
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
}));
sessionStore.sync(); // Creates the 'Sessions' table in the database if it doesn't exist.

// Passport Initialization: Sets up Passport for authentication.
app.use(passport.initialize());
app.use(passport.session());

// --- API Routes ---
// The server uses these modular route handlers.
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// --- Database Sync and Server Start ---
// This synchronizes all the defined models with the database and then starts the server.
// The 'force: false' option prevents dropping tables on every restart.
// Use 'force: true' during development if you make changes to your models.
db.sequelize.sync({ force: false }).then(() => {
    console.log('Database synced successfully.');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}.`);
        // Optional: Function to populate database with initial data
        require('./seeders/seedProducts')(); 
    });
}).catch(err => {
    console.error('Unable to sync database:', err);
});