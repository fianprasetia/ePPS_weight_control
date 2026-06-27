var koneksi = require("../config/database");
const Sequelize = require("sequelize");
const adm_employee = require("./adm_employee");
const adm_user_login = koneksi.define(
    "adm_user_login",
    {
        username: {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true
        },
        employee_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "adm_employee",
                key: "employee_id"
            },
            onDelete: "Cascade",
            onUpdate: "Cascade"
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        old_password: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        status: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        change_password: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
    },
    {
        freezeTableName: true,
    }
);
adm_user_login.belongsTo(adm_employee, { foreignKey: "employee_id" });
module.exports = adm_user_login;
