var koneksi = require('../config/database');
const Sequelize = require('sequelize');
const adm_company = koneksi.define(
    'adm_company',
    {
        code_company: {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        parent_code: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        level: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    },
    {
        freezeTableName: true,
    }
);
module.exports = adm_company;
