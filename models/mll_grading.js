const koneksi = require("../config/database");
const Sequelize = require("sequelize");
const mll_weigh_bridge = require("./mll_weigh_bridge");
const mll_grading = koneksi.define(
    "mll_grading",
    {
        grading_id: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        ticket_no: {
            type: Sequelize.STRING,
            allowNull: true,
            comment: 'No Tiket',
            references: {
                model: "mll_weigh_bridge",
                key: "ticket_no"
            },
            onDelete: "Cascade",
            onUpdate: "Cascade"
        },
        empty_bunches: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Janjang Kosong'
        },
        overripe_bunches: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Lewat Matang'
        },
        unripe_bunches: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Mentah'
        },
        long_stalk_bunches: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Tangkai Panjang'
        },
        mandatory_deduction: {
            type: Sequelize.DECIMAL(18, 3),
            allowNull: false,
            defaultValue: 0,
            comment: 'Potongan Wajib'
        },
    },
    {
        freezeTableName: true,
    }
);

mll_grading.belongsTo(mll_weigh_bridge, { foreignKey: "ticket_no" });

module.exports = mll_grading;
