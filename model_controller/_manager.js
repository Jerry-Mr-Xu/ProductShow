'use strict';

const Sequelize = require('sequelize');
const config = require('./_config');
const Factory = require('./_factory');
const fs = require('mz/fs');
const path = require('path');

let sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    port: config.port,
    dialect: 'mysql',
    operatorsAliases: Sequelize.Op,
    pool: {
        max: 5,
        min: 0,
        idle: 30000
    }
})

function getAllModelFiles() {
    // 得到当前文件夹下的所有Model文件名
    let modelFileNames = fs.readdirSync(__dirname).filter(fileName => {
        return /^model_\w+.js$/.test(fileName);
    });

    let modelMap = new Map();

    modelFileNames.forEach(fileName => {
        let modelFilePath = path.join(__dirname, fileName);
        let modelPrimaryObj = require(modelFilePath);
        let Model = Factory.packModel(sequelize, modelPrimaryObj);
        modelMap.set(Model.name, Model);
    });

    return modelMap;
}

let ModelManager = {
    models: getAllModelFiles(),
    getModel: function (modelName) {
        if (ModelManager.models.has(modelName)) {
            return ModelManager.models.get(modelName);
        } else {
            console.error(`Not Find model: ${modelName}`);
        }
    },
    sync: function () {
        if (process.env.NODE_ENV !== 'production') {
            console.log('sync database');
            sequelize.sync();
        }
    }
};

module.exports = ModelManager;