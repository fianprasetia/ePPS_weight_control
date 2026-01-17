const fs = require('fs');
const fsj = require('fs').promises;
const path = require('path');

const controller = {};

controller.translate = async function (req, res) {
    try {

        const { text, targetLangs } = req.body; // array of languages
        // const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
        const OPENROUTER_API_KEY = "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";

        const results = {};

        for (const lang of targetLangs) {
            const apiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "openai/gpt-4o-mini",
                    // model: "deepseek/deepseek-r1:free",
                    messages: [
                        { role: "system", content: "You are a translator. Translate text only, no explanation." },
                        { role: "user", content: `Translate this into ${lang}: ${text}` }
                    ]
                })
            });

            const data = await apiRes.json();
            results[lang] = data.choices[0].message.content.trim();
        }
        res.status(200).json({
            access: "success",
            data: results,
        });
        // return res.json({ translated: results });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Translation failed" });
    }
};
controller.autoTranslate = async function (req, res) {
    try {

        const { text, targetLangs } = req.body; // array of languages
        // const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
        const OPENROUTER_API_KEY = "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";

        const apiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "openai/gpt-4o-mini",
                // model: "deepseek/deepseek-r1:free",
                messages: [
                    { role: "system", content: "You are a translator. Translate text only, no explanation." },
                    { role: "user", content: `Translate this into ${targetLangs}: ${text}` }
                ]
            })
        });

        const data = await apiRes.json();
        const translated = data.choices[0].message.content.trim();
        res.status(200).json({
            access: "success",
            data: translated,
        });
        // return res.json({ translated: results });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Translation failed" });
    }
};
controller.inserttranslate = async function (req, res) {
    try {
        const newData = req.body["dataLanguage"][0]["detail"];
        const langCode = req.body["dataLanguage"][0]["language_POST"];
        const keyCode = req.body["dataLanguage"][0]["key_POST"];

        const filePath = path.join(__dirname, "../public/file/language.json");
        let data = JSON.parse(fs.readFileSync(filePath, "utf8"));

        const baseKey = keyCode || newData.find(d => d.code_POST === "en")?.language_POST;
        if (!baseKey) {
            return res.status(200).json({
                success: false,
                access: "failed",
                message: "Data dengan code_POST 'en' wajib ada untuk membuat key"
            });
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

            return res.status(200).json({
                success: false,
                access: "failed",
                message: messageTemplate
            });
        }

        // insert/update
        newData.forEach(item => {
            const l = data.find(d => d.language === item.code_POST);
            if (l) {
                l.content[key] = item.language_POST;
            }
        });

        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");

        return res.status(200).json({
            success: true,
            access: "success",
            message: lang?.content?.insert_data || "Insert success"
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
controller.updateTranslate = async function name(req, res) {
    const { dataLanguage } = req.body;
    const langCode = dataLanguage[0].language_POST; // bahasa respon
    const key = dataLanguage[0].key_POST;           // key yang akan diupdate
    const newData = dataLanguage[0].detail;         // array detail per bahasa

    const filePath = path.join(__dirname, "../public/file/language.json");
    let data = JSON.parse(fs.readFileSync(filePath, "utf8"));

    // Cek duplikasi
    let duplicateFound = false;
    newData.forEach(item => {
        const lang = data.find(d => d.language === item.code_POST);
        if (lang && lang.content[key] && lang.content[key] === item.language_POST) {
            duplicateFound = true;
        }
    });
    const lang = data.find(d => d.language === langCode);

    // if (duplicateFound) {
    //   return res.status(200).json({
    //     success: false,
    //     message: `Duplicate data found for key '${key}'`
    //   });
    // }

    // Update data
    newData.forEach(item => {
        const lang = data.find(d => d.language === item.code_POST);
        if (lang) {
            lang.content[key] = item.language_POST;
        }
    });
    let messageTemplate =
        lang?.content?.update_data ||
        `Data for key '${key}' updated successfully`;

    await fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
    messageTemplate = messageTemplate.replace("{key}", key);
    res.status(200).json({
        // success: true,
        access: "success",
        message: messageTemplate
    });
}

module.exports = controller;
