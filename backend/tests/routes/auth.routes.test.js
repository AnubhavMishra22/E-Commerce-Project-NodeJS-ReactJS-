// Unit tests for Auth routes

const request = require('supertest');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const { sequelize } = require('../helpers/testDb');
const { mockUsers } = require('../mocks/mockData');

// Initialize models
const UserModel = require('../../models/user.model');
const User = UserModel(sequelize, require('sequelize').DataTypes);

// Create express app for testing
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup session
app.use(session({
    secret: 'test-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 }
}));

// Setup passport
app.use(passport.initialize());
app.use(passport.session());

// Configure passport for testing
passport.use(require('passport-local').Strategy,
    async (email, password, done) => {
        try {
            const user = await User.findOne({ where: { email } });
            if (!user) return done(null, false, { message: 'Incorrect email.' });
            const isValid = await user.validPassword(password);
            if (!isValid) return done(null, false, { message: 'Incorrect password.' });
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

// Import auth routes
const authRoutes = require('../../routes/auth');
app.use('/api/auth', authRoutes);

describe('Auth Routes Tests', () => {
    beforeAll(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    afterEach(async () => {
        await User.destroy({ where: {}, truncate: true });
    });

    describe('POST /api/auth/register', () => {
        test('should register a new user with valid credentials', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'newuser@example.com',
                    password: 'password123'
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body.email).toBe('newuser@example.com');
        });

        test('should fail to register with invalid email', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'invalid-email',
                    password: 'password123'
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('errors');
        });

        test('should fail to register with short password', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'test@example.com',
                    password: '12345' // Less than 6 characters
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('errors');
        });

        test('should fail to register with duplicate email', async () => {
            await User.create({
                email: 'existing@example.com',
                password: 'password123'
            });

            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'existing@example.com',
                    password: 'password456'
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toContain('already exists');
        });

        test('should fail to register without email', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    password: 'password123'
                });

            expect(response.status).toBe(400);
        });

        test('should fail to register without password', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'test@example.com'
                });

            expect(response.status).toBe(400);
        });
    });

    describe('POST /api/auth/login', () => {
        beforeEach(async () => {
            await User.create({
                email: 'testuser@example.com',
                password: 'password123'
            });
        });

        test('should login with valid credentials', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'testuser@example.com',
                    password: 'password123'
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('id');
            expect(response.body.email).toBe('testuser@example.com');
        });

        test('should fail to login with invalid email format', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'invalid-email',
                    password: 'password123'
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('errors');
        });

        test('should fail to login without password', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'testuser@example.com'
                });

            expect(response.status).toBe(400);
        });

        test('should fail to login with non-existent user', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'nonexistent@example.com',
                    password: 'password123'
                });

            expect(response.status).toBe(401);
        });
    });

    describe('GET /api/auth/status', () => {
        test('should return 401 when not authenticated', async () => {
            const response = await request(app)
                .get('/api/auth/status');

            expect(response.status).toBe(401);
            expect(response.body.message).toContain('Not authenticated');
        });
    });

    describe('POST /api/auth/logout', () => {
        test('should logout successfully', async () => {
            const response = await request(app)
                .post('/api/auth/logout');

            expect(response.status).toBe(200);
            expect(response.body.message).toContain('Logged out successfully');
        });
    });
});
