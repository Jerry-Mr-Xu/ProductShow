'use strict';

const Sequelize = require('sequelize');

let ProductObj = {
    name: 'product',
    model: {
        name: Sequelize.STRING(50),
        factory: Sequelize.STRING(50),
        price: Sequelize.FLOAT
    }
};

module.exports = ProductObj;