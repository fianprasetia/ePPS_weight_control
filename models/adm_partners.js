const koneksi = require("../config/database");
const Sequelize = require("sequelize");
const adm_partners = koneksi.define(
    "adm_partners",
    {
        code_partners: {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        address: {
            type: Sequelize.TEXT,
            allowNull: true,
        },
        city: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        phone: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        email: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        contact_person: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        is_tbs_supplier: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        is_supplier: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        is_transporter: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        status: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        synch: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
    },
    {
        freezeTableName: true,
    }
);

module.exports = adm_partners;
