const Sequelize = require('sequelize')
const sequelize = require('../utils/database')
const User = sequelize.define('User', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: Sequelize.STRING,
    email: Sequelize.STRING
})
module.exports = User