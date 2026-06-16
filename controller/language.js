const model = require("../models/index");
const messages = require("./message");
const responseHelper = require('../helpers/responseHelper');

const controller = {};

controller.selectLanguage = async function (req, res) {
    try {
        const language = req.body.language_POST || 'en';
        const selectLanguageData = await model.adm_language.findAll({
            order: [
                ['language_code', 'ASC'],
            ],
        });
        if (selectLanguageData.length > 0) {
            return responseHelper.success(res, "successfulData", selectLanguageData);
        } else {
            return responseHelper.Unsuccessful(res, messages[language]?.nodata || "No data available", []);
        }
    } catch (error) {
        return responseHelper.error(res, error, "Terjadi kesalahan saat memproses data bahasa");
    }
};

module.exports = controller;