const koneksi = require("../config/database");
const Sequelize = require("sequelize");
const adm_vehicle_number = koneksi.define(
    "adm_vehicle_number",
    {
        id_vehicle_number: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        no_vehicle: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        status: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
    },
    {
        freezeTableName: true,
    }
);

module.exports = adm_vehicle_number;
