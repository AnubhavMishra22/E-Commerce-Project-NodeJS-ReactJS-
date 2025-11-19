-- Initialize Database for QuantumCart E-Commerce
-- This script runs automatically when MySQL container starts for the first time

-- Create database if it doesn't exist (already created by docker-compose)
-- CREATE DATABASE IF NOT EXISTS ecommerce_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE ecommerce_db;

-- Grant privileges to the user (already created by docker-compose)
-- This is redundant but ensures proper permissions
GRANT ALL PRIVILEGES ON ecommerce_db.* TO 'ecommerce_user'@'%';
FLUSH PRIVILEGES;

-- Note: Sequelize will auto-create tables based on models when backend starts
-- Tables: users, products, orders, orderitems, sessions

SELECT 'Database initialization completed successfully!' AS message;
