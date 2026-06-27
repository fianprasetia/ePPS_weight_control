const fs = require('fs');
const path = require('path');
const { GoogleGenAI } = require("@google/genai");
const responseHelper = require('../helpers/responseHelper');

const controller = {};

controller.translate = async function (req, res) {
    try {
        const { text, targetLangs } = req.body;

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY
        });

        const results = {};

        for (const lang of targetLangs) {
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `
                    Translate the following text into ${lang}.
                    Return only the translated text without explanation.

                    Text:
                    ${text}
                `
            });

            results[lang] = response.text.trim();
        }

        return responseHelper.success(res, "Translation success", results);

    } catch (err) {
        return responseHelper.error(res, err, "Translation failed");
    }
};

controller.autoTranslate = async function (req, res) {
    try {
        const { text, targetLangs } = req.body;
        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

        if (!GEMINI_API_KEY) {
            return responseHelper.error(res, new Error("API Key is not configured."), "API Key is not configured.");
        }

        const ai = new GoogleGenAI({
            apiKey: GEMINI_API_KEY
        });

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `
                        You are a translator.

                        Translate the following text into ${targetLangs}.

                        Return only the translated text without explanation.

                        Text:
                        ${text}
                        `
        });

        const translated = response.text.trim();
        return responseHelper.success(res, "Translation success", translated);

    } catch (err) {
        return responseHelper.error(res, err, "Translation failed");
    }
};

controller.inserttranslate = async function (req, res) {
    try {
        const newData = req.body["dataLanguage"][0]["detail"];
        const langCode = req.body["dataLanguage"][0]["language_POST"];
        const keyCode = req.body["dataLanguage"][0]["key_POST"];

        const filePath = path.join(__dirname, "../public/file/language.json");
        const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

        const baseKey = keyCode || newData.find(d => d.code_POST === "en")?.language_POST;
        if (!baseKey) {
            return responseHelper.Unsuccessful(res, "Data dengan code_POST 'en' wajib ada untuk membuat key");
        }

        const key = baseKey.toLowerCase().replace(/\s+/g, "_");

        // tentukan bahasa respon
        const lang = data.find(d => d.language === langCode);

        let duplicateFound = false;
        newData.forEach(item => {
            const l = data.find(d => d.language === item.code_POST);
            if (l) {
                if (l.content[key] && l.content[key] === item.language_POST) {
                    duplicateFound = true;
                }
            }
        });

        if (duplicateFound) {
            let messageTemplate =
                lang?.content?.duplicate_error ||
                "Duplicate data found for key '{key}'";
            messageTemplate = messageTemplate.replace("{key}", key);

            return responseHelper.Unsuccessful(res, messageTemplate);
        }

        // insert/update
        newData.forEach(item => {
            const l = data.find(d => d.language === item.code_POST);
            if (l) {
                l.content[key] = item.language_POST;
            }
        });

        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");

        return responseHelper.success(res, lang?.content?.insert_data || "Insert success");
    } catch (err) {
        return responseHelper.error(res, err, "Terjadi kesalahan saat menyimpan data terjemahan");
    }
};

controller.updateTranslate = async function (req, res) {
    try {
        const { dataLanguage } = req.body;
        const langCode = dataLanguage[0].language_POST; // bahasa respon
        const key = dataLanguage[0].key_POST;           // key yang akan diupdate
        const newData = dataLanguage[0].detail;         // array detail per bahasa

        const filePath = path.join(__dirname, "../public/file/language.json");
        const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

        // Cek duplikasi
        let duplicateFound = false;
        newData.forEach(item => {
            const lang = data.find(d => d.language === item.code_POST);
            if (lang && lang.content[key] && lang.content[key] === item.language_POST) {
                duplicateFound = true;
            }
        });
        const lang = data.find(d => d.language === langCode);

        // Update data
        newData.forEach(item => {
            const l = data.find(d => d.language === item.code_POST);
            if (l) {
                l.content[key] = item.language_POST;
            }
        });
        let messageTemplate =
            lang?.content?.update_data ||
            `Data for key '${key}' updated successfully`;

        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
        messageTemplate = messageTemplate.replace("{key}", key);
        return responseHelper.success(res, messageTemplate);
    } catch (err) {
        return responseHelper.error(res, err, "Terjadi kesalahan saat memperbarui terjemahan");
    }
};

module.exports = controller;
