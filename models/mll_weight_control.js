const koneksi = require('../config/database');
const Sequelize = require('sequelize');
const adm_company = require('./adm_company');
const mll_weight_control = koneksi.define(
    'mll_weight_control',
    {
        weight_control_code: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        code_company: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        code_mill: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        name_company: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        name_mill: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        note: {
            type: Sequelize.TEXT,
            allowNull: true,
        },
    },
    {
        freezeTableName: true,
    }
);
module.exports = mll_weight_control;
