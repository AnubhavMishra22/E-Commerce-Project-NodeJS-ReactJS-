// Unit tests for User model

const { sequelize } = require('../helpers/testDb');
const UserModel = require('../../models/user.model');
const bcrypt = require('bcryptjs');

// Initialize User model with test database
const User = UserModel(sequelize, require('sequelize').DataTypes);

describe('User Model Tests', () => {
    beforeAll(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    afterEach(async () => {
        await User.destroy({ where: {}, truncate: true });
    });

    describe('User Creation', () => {
        test('should create a new user with valid data', async () => {
            const userData = {
                email: 'test@example.com',
                password: 'password123'
            };

            const user = await User.create(userData);

            expect(user).toBeDefined();
            expect(user.id).toBeDefined();
            expect(user.email).toBe(userData.email);
            expect(user.password).not.toBe(userData.password); // Password should be hashed
        });

        test('should hash password before creating user', async () => {
            const userData = {
                email: 'test@example.com',
                password: 'plainPassword123'
            };

            const user = await User.create(userData);

            expect(user.password).not.toBe(userData.password);
            expect(user.password.length).toBeGreaterThan(userData.password.length);

            // Verify it's a valid bcrypt hash
            const isValidHash = await bcrypt.compare(userData.password, user.password);
            expect(isValidHash).toBe(true);
        });

        test('should fail to create user without email', async () => {
            const userData = {
                password: 'password123'
            };

            await expect(User.create(userData)).rejects.toThrow();
        });

        test('should fail to create user without password', async () => {
            const userData = {
                email: 'test@example.com'
            };

            await expect(User.create(userData)).rejects.toThrow();
        });

        test('should fail to create user with invalid email', async () => {
            const userData = {
                email: 'invalid-email',
                password: 'password123'
            };

            await expect(User.create(userData)).rejects.toThrow();
        });

        test('should fail to create user with duplicate email', async () => {
            const userData = {
                email: 'duplicate@example.com',
                password: 'password123'
            };

            await User.create(userData);
            await expect(User.create(userData)).rejects.toThrow();
        });
    });

    describe('User Update', () => {
        test('should hash password when updating', async () => {
            const user = await User.create({
                email: 'test@example.com',
                password: 'oldPassword123'
            });

            const oldPasswordHash = user.password;

            await user.update({ password: 'newPassword456' });

            expect(user.password).not.toBe('newPassword456');
            expect(user.password).not.toBe(oldPasswordHash);

            const isValidNewPassword = await bcrypt.compare('newPassword456', user.password);
            expect(isValidNewPassword).toBe(true);
        });

        test('should not rehash password when updating other fields', async () => {
            const user = await User.create({
                email: 'test@example.com',
                password: 'password123'
            });

            const originalPasswordHash = user.password;

            await user.update({ email: 'newemail@example.com' });

            expect(user.password).toBe(originalPasswordHash);
        });
    });

    describe('Password Validation', () => {
        test('should validate correct password', async () => {
            const userData = {
                email: 'test@example.com',
                password: 'correctPassword123'
            };

            const user = await User.create(userData);
            const isValid = await user.validPassword('correctPassword123');

            expect(isValid).toBe(true);
        });

        test('should reject incorrect password', async () => {
            const userData = {
                email: 'test@example.com',
                password: 'correctPassword123'
            };

            const user = await User.create(userData);
            const isValid = await user.validPassword('wrongPassword');

            expect(isValid).toBe(false);
        });

        test('should reject empty password', async () => {
            const userData = {
                email: 'test@example.com',
                password: 'correctPassword123'
            };

            const user = await User.create(userData);
            const isValid = await user.validPassword('');

            expect(isValid).toBe(false);
        });
    });

    describe('User Retrieval', () => {
        test('should find user by email', async () => {
            await User.create({
                email: 'findme@example.com',
                password: 'password123'
            });

            const user = await User.findOne({ where: { email: 'findme@example.com' } });

            expect(user).toBeDefined();
            expect(user.email).toBe('findme@example.com');
        });

        test('should find user by id', async () => {
            const createdUser = await User.create({
                email: 'test@example.com',
                password: 'password123'
            });

            const user = await User.findByPk(createdUser.id);

            expect(user).toBeDefined();
            expect(user.id).toBe(createdUser.id);
            expect(user.email).toBe('test@example.com');
        });

        test('should return null for non-existent user', async () => {
            const user = await User.findOne({ where: { email: 'nonexistent@example.com' } });

            expect(user).toBeNull();
        });
    });
});
