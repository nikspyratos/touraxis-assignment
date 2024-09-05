'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Task extends Model {
        static associate(models) {
            Task.belongsTo(models.User, {
                foreignKey: 'user_id',
                as: 'user'
            });
        }
    }
    Task.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',  // This should be the table name, not the model name
                key: 'id'
            }
        },
        status: {
            type: DataTypes.ENUM('pending', 'complete'),
            defaultValue: 'pending',
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        date_time: {
            type: DataTypes.DATE,
            allowNull: false
        },
        next_execute_date_time: {
            type: DataTypes.DATE,
            allowNull: true
        },
    }, {
        sequelize,  // Add this line
        modelName: 'Task',
        tableName: 'tasks',
        timestamps: true
    });
    return Task;
};