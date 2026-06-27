const model = require("../models/index");
const messages = require("./message");
const koneksi = require("../config/database");
const { Op } = require("sequelize");
const logger = require('./logger');
const responseHelper = require('../helpers/responseHelper');

const controller = {};

controller.selectMenu = async function (req, res) {
    try {
        const language = req.body.language_POST || 'en';
        const selectMenuData = await model.adm_menu.findAll({
            include: [
                {
                    model: model.adm_menu_translations,
                    attributes: ["translation"],
                    where: {
                        language_code: language
                    },
                }
            ],
            order: [
                ['level', 'ASC'],
                ['no_ordinal', 'ASC'],
            ],
        });
        if (selectMenuData.length > 0) {
            return responseHelper.success(res, "successfulData", selectMenuData);
        } else {
            return responseHelper.Unsuccessful(res, messages[language]?.nodata || "No data available", []);
        }
    } catch (error) {
        return responseHelper.error(res, error, "Terjadi kesalahan saat memproses data menu");
    }
};

controller.selectMenuByCode = async function (req, res) {
    try {
        const language = req.body.language_POST || 'en';
        const code = req.body.code_POST;
        const selectMenuByCodeData = await model.adm_menu.findAll({
            include: {
                model: model.adm_menu_translations,
                attributes: ["language_code", "translation"],
                order: [
                    ['language_code', 'ASC'],
                ],
            },
            where: {
                id_menu: code
            },
        });
        if (selectMenuByCodeData.length > 0) {
            return responseHelper.success(res, "data success", selectMenuByCodeData);
        } else {
            return responseHelper.Unsuccessful(res, messages[language]?.nodata || "No data available", []);
        }
    } catch (error) {
        return responseHelper.error(res, error, "Terjadi kesalahan saat mencari menu berdasarkan kode");
    }
};

controller.updateMenu = async function (req, res) {
    const transaction = await koneksi.transaction();
    try {
        const language = req.body[0].language_POST || 'en';
        const username = req.body[0].username_POST;
        const code = req.params.code;
        const level = req.body[0].level_POST;
        const parent = req.body[0].parent_POST;
        const url = req.body[0].url_POST;
        const icon = req.body[0].icon_POST;
        const batch = req.body[0].batch_POST;
        const languageMenu = req.body[0].detail[0].language_POST;

        const updateMenuData = await model.adm_menu.update(
            {
                parent_id: parent,
                level: level,
                page: url,
                icon: icon,
                no_ordinal: batch,
                description: languageMenu,
            },
            {
                where: {
                    id_menu: code
                },
                transaction,
            },
        );

        if (!updateMenuData) {
            await transaction.rollback();
            return responseHelper.Unsuccessful(res, messages[language]?.nodata || "No data available");
        }

        const selectLanguageData = await model.adm_language.findAll({
            order: [
                ['language_code', 'ASC'],
            ],
            transaction
        });

        if (!selectLanguageData) {
            await transaction.rollback();
            return responseHelper.Unsuccessful(res, "Insert data failed", []);
        }

        await model.adm_menu_translations.destroy({
            where: {
                id_menu: code
            },
            transaction
        });

        const languageData = [];
        const jmlData = req.body[0].detail.length;
        for (let i = 0; i < jmlData; i++) {
            languageData.push({
                id_menu: code,
                language_code: selectLanguageData[i].language_code,
                translation: req.body[0].detail[i].language_POST
            });
        }

        const insertMenuData = await model.adm_menu_translations.bulkCreate(
            languageData,
            { transaction }
        );

        if (insertMenuData) {
            await transaction.commit();
            logger.info('Update Menu', {
                "1.username": `${username}`,
                "2.module": 'updateMenu',
                "3.status": 'success',
                "4.action": req.body
            });
            return responseHelper.success(res, messages[language]?.updateData, insertMenuData);
        } else {
            await transaction.rollback();
            return responseHelper.Unsuccessful(res, messages[language]?.nodata, []);
        }

    } catch (error) {
        await transaction.rollback();
        return responseHelper.error(res, error, "Terjadi kesalahan saat memperbarui menu");
    }
};

controller.insertMenu = async function (req, res) {
    const transaction = await koneksi.transaction();
    try {
        const language = req.body[0].language_POST || 'en';
        const username = req.body[0].username_POST;
        const level = req.body[0].level_POST;
        const parent = req.body[0].parent_POST;
        const url = req.body[0].url_POST;
        const icon = req.body[0].icon_POST;
        const batch = req.body[0].batch_POST;
        const languageMenu = req.body[0].detail[0].language_POST;

        const insertMenuData = await model.adm_menu.create(
            {
                parent_id: parent,
                level: level,
                page: url,
                icon: icon,
                no_ordinal: batch,
                description: languageMenu,
            },
            { transaction }
        );

        if (!insertMenuData) {
            await transaction.rollback();
            return responseHelper.Unsuccessful(res, messages[language]?.nodata, []);
        }

        const selectLanguageData = await model.adm_language.findAll({
            order: [
                ['language_code', 'ASC'],
            ],
            transaction
        });

        if (!selectLanguageData) {
            await transaction.rollback();
            return responseHelper.Unsuccessful(res, "Insert data failed", []);
        }

        const codeMenu = insertMenuData.id_menu;
        const languageData = [];
        const jmlData = req.body[0].detail.length;
        for (let i = 0; i < jmlData; i++) {
            languageData.push({
                id_menu: codeMenu,
                language_code: selectLanguageData[i].language_code,
                translation: req.body[0].detail[i].language_POST
            });
        }

        const insertMenuTranslationsData = await model.adm_menu_translations.bulkCreate(
            languageData,
            { transaction }
        );

        if (insertMenuTranslationsData) {
            await transaction.commit();
            logger.info('Insert Menu', {
                "1.username": `${username}`,
                "2.module": 'insertMenu',
                "3.status": 'success',
                "4.action": req.body
            });
            return responseHelper.success(res, messages[language]?.insertData, insertMenuTranslationsData);
        } else {
            await transaction.rollback();
            return responseHelper.Unsuccessful(res, messages[language]?.nodata, []);
        }

    } catch (error) {
        await transaction.rollback();
        return responseHelper.error(res, error, "Terjadi kesalahan saat menambahkan menu");
    }
};

module.exports = controller;