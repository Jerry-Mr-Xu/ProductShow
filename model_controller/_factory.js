'use strict';

const Sequelize = require('sequelize');

let Factory = {
    defaultHooks: {
        beforeValidate: (record) => {
            if (!record.hasOwnProperty('createdAt')) {
                record.createdAt = 0;
            }
            if (!record.hasOwnProperty('updatedAt')) {
                record.updatedAt = 0;
            }
            if (!record.hasOwnProperty('version')) {
                record.version = 0;
            }
        },
        beforeCreate: (record) => {
            let now = Date.now();
            record.createdAt = now;
            record.updatedAt = now;
            record.version = 0;
        },
        beforeUpdate: (record) => {
            let now = Date.now();
            record.updatedAt = now;
        }
    },
    packModel: function (sequelize, primaryModelObj) {
        let
            name = primaryModelObj.name,
            model = primaryModelObj.model,
            hooks = primaryModelObj.hooks,
            packedModel = {};

        for (const colName in model) {
            if (model.hasOwnProperty(colName)) {
                const colType = model[colName];
                if (typeof colType === 'object' && colType.type) {
                    colType.allowNull = colType.allowNull || false;
                    packedModel[colName] = colType;
                } else {
                    packedModel[colName] = {
                        type: colType,
                        allowNull: false
                    }
                }
            }
        }

        packedModel.id = {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        };

        packedModel.createdAt = {
            type: Sequelize.BIGINT,
            allowNull: false
        };

        packedModel.updatedAt = {
            type: Sequelize.BIGINT,
            allowNull: false
        };

        packedModel.version = {
            type: Sequelize.INTEGER,
            allowNull: false
        };

        if (hooks) {
            for (const key in Factory.defaultHooks) {
                if (defaultHooks.hasOwnProperty(key)) {
                    const defaultHook = defaultHooks[key];
                    if (hooks.hasOwnProperty(key)) {
                        hooks[key] = record => {
                            defaultHook[key](record);
                            hooks[key](record);
                        }
                    } else {
                        hooks[key] = defaultHook[key];
                    }
                }
            }
        } else {
            hooks = Factory.defaultHooks;
        }

        return sequelize.define(name, packedModel, {
            timestamps: false,
            hooks: hooks
        });
    }
};

module.exports = Factory;