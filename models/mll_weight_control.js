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
            // references: {
            //     model: 'adm_company',
            //     key: 'code_company',
            // },
            // onDelete: 'SET NULL',
            // onUpdate: 'Cascade',
        },
        mill: {
            type: Sequelize.STRING,
            allowNull: false,
            // references: {
            //     model: 'adm_company',
            //     key: 'code_company',
            // },
            // onDelete: 'SET NULL',
            // onUpdate: 'Cascade',
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
// mll_weight_control.belongsTo(adm_company, { foreignKey: 'mill', as: 'factory' });
// mll_weight_control.belongsTo(adm_company, { foreignKey: 'code_company', as: 'company' });
module.exports = mll_weight_control;
