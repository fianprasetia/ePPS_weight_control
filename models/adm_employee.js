const koneksi = require("../config/database");
const Sequelize = require("sequelize");
const adm_employee = koneksi.define(
  "adm_employee",
  {
    employee_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    fullname: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);
module.exports = adm_employee;
