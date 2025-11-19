// Test database helper for setting up and tearing down test database

const { Sequelize } = require('sequelize');

// Create in-memory SQLite database for testing
const sequelize = new Sequelize('sqlite::memory:', {
    logging: false, // Disable logging during tests
    dialect: 'sqlite'
});

// Setup function to sync database before tests
const setupTestDb = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ force: true });
        console.log('Test database synced successfully');
    } catch (error) {
        console.error('Unable to sync test database:', error);
        throw error;
    }
};

// Teardown function to close database after tests
const teardownTestDb = async () => {
    try {
        await sequelize.close();
        console.log('Test database connection closed');
    } catch (error) {
        console.error('Error closing test database:', error);
        throw error;
    }
};

// Clean database between tests
const cleanTestDb = async () => {
    try {
        await sequelize.sync({ force: true });
    } catch (error) {
        console.error('Error cleaning test database:', error);
        throw error;
    }
};

module.exports = {
    sequelize,
    setupTestDb,
    teardownTestDb,
    cleanTestDb
};
