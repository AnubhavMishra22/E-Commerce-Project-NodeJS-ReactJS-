module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define("order", {
        total: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        }
    });
    return Order;
};