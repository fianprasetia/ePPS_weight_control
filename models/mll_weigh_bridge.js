const koneksi = require("../config/database");
const Sequelize = require("sequelize");
const adm_employee = require("./adm_employee");
const adm_company = require("./adm_company");
const mll_weigh_bridge = koneksi.define(
    "mll_weigh_bridge",
    {
        ticket_no: {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true,
        },
        company_code: {
            type: Sequelize.STRING,
            allowNull: false,
            comment: "kode perusahaan"
        },
        mill_code: {
            type: Sequelize.STRING,
            allowNull: false,
            comment: "kode pabrik"
        },
        estate_code: {
            type: Sequelize.STRING,
            allowNull: true,
            comment: "kode kebun"
        },
        division_code: {
            type: Sequelize.STRING,
            allowNull: true,
            comment: "kode divisi",
            references: {
                model: "adm_company",
                key: "code_company"
            },
            onDelete: "SET NULL",
            onUpdate: "Cascade",
        },
        unit_type: {
            type: Sequelize.STRING,
            allowNull: true,
            comment: "tipe unit"
        },
        ffa: {
            type: Sequelize.DECIMAL,
            allowNull: true,
            comment: "ffa"
        },
        moist: {
            type: Sequelize.DECIMAL,
            allowNull: true,
            comment: "kelembaban"
        },
        dirt: {
            type: Sequelize.DECIMAL,
            allowNull: true,
            comment: "kotoran"
        },
        dobi: {
            type: Sequelize.DECIMAL,
            allowNull: true,
            comment: "dobi"
        },
        transaction_type: {
            type: Sequelize.STRING,
            allowNull: false,
            comment: "IN / OUT"
        },
        entry_time: {
            type: Sequelize.DATE,
            allowNull: true,
            comment: "jam masuk"
        },
        exit_time: {
            type: Sequelize.DATE,
            allowNull: true,
            comment: "jam keluar"
        },
        gross_weight: {
            type: Sequelize.DECIMAL,
            allowNull: true,
            comment: "berat masuk"
        },
        tare_weight: {
            type: Sequelize.DECIMAL,
            allowNull: true,
            comment: "berat keluar"
        },
        bruto: {
            type: Sequelize.DECIMAL,
            allowNull: true,
            comment: "bruto"
        },
        deduction: {
            type: Sequelize.DECIMAL,
            allowNull: true,
            comment: "pengurangan"
        },
        netto: {
            type: Sequelize.DECIMAL,
            allowNull: true,
            comment: "neto"
        },
        uom: {
            type: Sequelize.STRING,
            allowNull: true,
            comment: "satuan"
        },
        code_item: {
            type: Sequelize.INTEGER,
            allowNull: false,
            comment: "kode barang"
        },
        sales_contract: {
            type: Sequelize.STRING,
            allowNull: true,
            comment: "no kontrak"
        },
        driver_name: {
            type: Sequelize.STRING,
            allowNull: true,
            comment: "nama sopir"
        },
        spb_no: {
            type: Sequelize.STRING,
            allowNull: true,
            comment: "no surat perintah bawa"
        },
        vehicle_no: {
            type: Sequelize.STRING,
            allowNull: true,
            comment: "no kendaraan"
        },
        seal_no: {
            type: Sequelize.STRING,
            allowNull: true,
            comment: "no segel"
        },
        bunch_count: {
            type: Sequelize.INTEGER,
            allowNull: true,
            comment: "janjang"
        },
        loose_fruit: {
            type: Sequelize.INTEGER,
            allowNull: true,
            comment: "brondol"
        },
        year_plant: {
            type: Sequelize.STRING,
            allowNull: true,
            comment: "tahun tanam"
        },
        ffb_source: {
            type: Sequelize.STRING,
            allowNull: true,
            comment: "sumber TBS"
        },
        created_by: {
            type: Sequelize.INTEGER,
            allowNull: false,
            comment: "dibuat oleh",
            references: {
                model: "adm_employee",
                key: "employee_id"
            },
            onDelete: "Cascade",
            onUpdate: "Cascade"
        },
        note: {
            type: Sequelize.TEXT,
            allowNull: true,
            comment: 'catatan'
        },
        status: {
            type: Sequelize.INTEGER,
            allowNull: true,
            comment: '1: IN, 2: OUT, 3: SYNC'
        },


    },
    {
        freezeTableName: true,
    }
);
mll_weigh_bridge.belongsTo(adm_employee, { foreignKey: 'created_by' });
mll_weigh_bridge.belongsTo(adm_company, { foreignKey: 'division_code', as: 'division' });
module.exports = mll_weigh_bridge;
