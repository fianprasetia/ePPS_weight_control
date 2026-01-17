const path = require('path');
const fs = require('fs');
const messages = require("../public/file/language.json")
const controller = {};

controller.deleteFile = async function (req, res) {
    try {
        const language = req.body.language_POST
        const file = req.body.delete_POST;
        if (!file) {
            return res.status(400).json({
                access: "failed",
                message: "Nama file tidak diberikan",
            });
        }
        const filePath = path.join(__dirname, '../public/', file);
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                access: "failed",
                message: "File tidak ditemukan",
            });
        }
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Gagal menghapus file:', err);
                return res.status(500).json({
                    access: "failed",
                    message: "Gagal menghapus file",
                });
            }
            res.status(200).json({
                access: "success",
                message: messages.find(msg => msg.language === language)?.content.download_successful
            });
        });
    } catch (error) {
        console.error('Terjadi kesalahan:', error);
        res.status(500).json({
            access: "failed",
            message: "Terjadi kesalahan saat menghapus file",
        });
    }
};

module.exports = controller;
