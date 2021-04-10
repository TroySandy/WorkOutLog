const Sequelize = require('sequelize');

const sequelize = new Sequelize("postgres://postgres:Beta2682@localhost:5432/WorkOutLog")

module.exports = sequelize;