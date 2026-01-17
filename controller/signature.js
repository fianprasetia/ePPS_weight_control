const path = require('path');
const fs = require('fs');
const messages = require("../public/file/language.json");
const controller = {};

controller.insertPhoto = async function (req, res) {
    try {
        const jsonData = JSON.parse(req.body.data);
        const employeeID = jsonData["employeeID_POST"]
        const language = jsonData["language_POST"]
        if (req.file) {
            const photoFile = req.file;
            const identityNumber = employeeID
            const fileExtension = path.extname(photoFile.originalname).toLowerCase();

            if (fileExtension !== '.png') {
                res.status(200).json({
                    access: "failed",
                    message: messages.find(msg => msg.language === language)?.content.png,
                });
                return false
            }
            const newFileName = `${identityNumber}${fileExtension}`;
            const oldFilePath = path.join(__dirname, '../public/file/signature/', photoFile.filename);
            const newFilePath = path.join(__dirname, '../public/file/signature/', newFileName);
            fs.renameSync(oldFilePath, newFilePath);
            return res.status(200).json({
                access: "success",
            });
        } else {
            return res.status(200).json({
                access: "failed",
            });
        }
    } catch (error) {
        console.error('Terjadi kesalahan:', error);
        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat memproses file.",
        });
    }
};
controller.updatePhoto = async function (req, res) {
    try {
        const jsonData = JSON.parse(req.body.data);
        const employeeID = jsonData["employeeID_POST"]
        const language = jsonData["language_POST"]
        if (req.file) {
            const photoFile = req.file;
            const identityNumber = employeeID
            const fileExtension = path.extname(photoFile.originalname).toLowerCase();

            if (fileExtension !== '.png') {
                res.status(200).json({
                    access: "failed",
                    message: messages.find(msg => msg.language === language)?.content.png,
                });
                return false
            }
            const newFileName = `${identityNumber}${fileExtension}`;
            const oldFilePath = path.join(__dirname, '../public/file/signature/', photoFile.filename);
            const newFilePath = path.join(__dirname, '../public/file/signature/', newFileName);
            fs.renameSync(oldFilePath, newFilePath);
            return res.status(200).json({
                access: "success",
            });
        } else {
            return res.status(200).json({
                access: "success",
            });
        }
    } catch (error) {
        console.error('Terjadi kesalahan:', error);
        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan saat memproses file.",
        });
    }
};

module.exports = controller;
