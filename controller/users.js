const model = require("../models/index");
const messages = require("./message");
const koneksi = require("../config/database");
const sequelize = require("sequelize");
const md5 = require("md5");
const { Op } = require("sequelize");
const logger = require('./logger');
const responseHelper = require('../helpers/responseHelper');

const controller = {};

controller.selectUsers = async function (req, res) {
    try {
        const language = req.body.language_POST || 'en';
        const selectLoginData = await model.adm_user_login.findAll({
            include: [
                {
                    model: model.adm_employee,
                },
            ],
        });
        if (selectLoginData.length > 0) {
            return responseHelper.success(res, messages[language]?.insertData || "Users retrieved successfully", selectLoginData);
        } else {
            return responseHelper.Unsuccessful(res, messages[language]?.nodata || "No data available", []);
        }
    } catch (error) {
        return responseHelper.error(res, error, "Terjadi kesalahan saat mengambil data users");
    }
};

controller.insertUsers = async function (req, res) {
    const transaction = await koneksi.transaction();
    try {
        const language = req.body.language_POST || 'en';
        const username = req.body.username_POST;
        const employeeId = req.body.employeeID_POST;
        const password = md5(req.body.password_POST);
        const status = req.body.status_POST;

        const insertLoginData = await model.adm_user_login.findAll({
            where: {
                username: username
            },
            transaction
        });

        if (insertLoginData.length > 0) {
            await transaction.rollback();
            return responseHelper.Unsuccessful(res, messages[language]?.userExists || "Username already exists");
        }

        const insertLoginNewData = await model.adm_user_login.create(
            {
                username: username,
                employee_id: employeeId,
                password: password,
                old_password: password,
                change_password: 0,
                status: status,
            },
            { transaction }
        );

        if (insertLoginNewData) {
            await transaction.commit();
            return responseHelper.success(res, messages[language]?.insertData, insertLoginNewData);
        } else {
            await transaction.rollback();
            return responseHelper.Unsuccessful(res, messages[language]?.failedData || "Insert user failed");
        }
    } catch (error) {
        await transaction.rollback();
        return responseHelper.error(res, error, "Terjadi kesalahan saat menambahkan user baru");
    }
};

controller.selectUsersByUsername = async function (req, res) {
    try {
        const language = req.body.language_POST || 'en';
        const username = req.body.username_POST;
        const selectUsersByUsernameData = await model.adm_user_login.findAll({
            include: [
                {
                    model: model.adm_employee,
                },
            ],
            where: {
                username: username
            },
        });
        if (selectUsersByUsernameData.length > 0) {
            return responseHelper.success(res, "data success", selectUsersByUsernameData);
        } else {
            return responseHelper.Unsuccessful(res, messages[language]?.nodata || "No data available", []);
        }
    } catch (error) {
        return responseHelper.error(res, error, "Terjadi kesalahan saat mencari user");
    }
};

controller.updatePassword = async function (req, res) {
    const transaction = await koneksi.transaction();
    try {
        const username = req.params.username;
        const language = req.body.language_POST || 'en';
        const password = md5(req.body.password_POST);

        const updatePasswordData = await model.adm_user_login.update(
            {
                password: password,
                old_password: password,
                change_password: 0,
            },
            {
                where: {
                    username: username
                },
                transaction
            },
        );

        if (updatePasswordData[0] > 0) {
            await transaction.commit();
            return responseHelper.success(res, messages[language]?.updateData, updatePasswordData);
        } else {
            await transaction.rollback();
            return responseHelper.Unsuccessful(res, messages[language]?.nodata || "No data available", []);
        }
    } catch (error) {
        await transaction.rollback();
        return responseHelper.error(res, error, "Terjadi kesalahan saat memperbarui password");
    }
};

controller.updateUsers = async function (req, res) {
    const transaction = await koneksi.transaction();
    try {
        const username = req.params.username;
        const language = req.body.language_POST || 'en';
        const employeeID = req.body.employeeID_POST;
        const status = req.body.status_POST;

        const updateUsersData = await model.adm_user_login.update(
            {
                username: username,
                status: status,
            },
            {
                where: {
                    employee_id: employeeID,
                },
                transaction
            },
        );

        if (updateUsersData[0] > 0) {
            await transaction.commit();
            return responseHelper.success(res, messages[language]?.updateData, updateUsersData);
        } else {
            await transaction.rollback();
            return responseHelper.Unsuccessful(res, messages[language]?.nodata || "No data available", []);
        }
    } catch (error) {
        await transaction.rollback();
        return responseHelper.error(res, error, "Terjadi kesalahan saat memperbarui user");
    }
};

controller.selectAuthByUsername = async function (req, res) {
    try {
        const language = req.body.language_POST || 'en';
        const username = req.body.username_POST;

        const selectAuthByUsernameData = await model.adm_authentication.findAll({
            include: [
                {
                    model: model.adm_menu,
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
                }
            ],
            where: {
                username: username
            },
            order: [
                ['id_menu', 'ASC'],
            ],
        });

        if (selectAuthByUsernameData.length > 0) {
            const arrIdMenu = selectAuthByUsernameData.map(auth => auth.id_menu);
            const getMenuAll = await model.adm_menu.findAll({
                include: [
                    {
                        model: model.adm_menu_translations,
                        attributes: ["translation"],
                        where: {
                            language_code: language
                        },
                    }
                ],
                where: {
                    id_menu: {
                        [Op.notIn]: arrIdMenu
                    }
                },
                order: [
                    ['id_menu', 'ASC'],
                    ['no_ordinal', 'ASC'],
                ],
            });

            const responseData = {
                dataAuth: selectAuthByUsernameData,
                dataMenu: getMenuAll,
            };

            return responseHelper.success(res, "Akun privilege anda", responseData);
        } else {
            const getMenuAll2Data = await model.adm_menu.findAll({
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
                    ['id_menu', 'ASC'],
                    ['no_ordinal', 'ASC'],
                ],
            });

            const responseData = {
                dataAuth: [],
                dataMenu: getMenuAll2Data,
            };

            if (getMenuAll2Data.length > 0) {
                return responseHelper.success(res, "Retrieved all menus", responseData);
            } else {
                return responseHelper.Unsuccessful(res, messages[language]?.nodata || "No data available", responseData);
            }
        }
    } catch (error) {
        return responseHelper.error(res, error, "Terjadi kesalahan saat mengambil privilege user");
    }
};

controller.insertAuthByUsername = async function (req, res) {
    const transaction = await koneksi.transaction();
    try {
        const username = req.body["dataAuth"][0]["username_POST"];
        const language = req.body["dataLanguage"]["language_POST"] || 'en';
        const usernameLogin = req.body["dataUsername"]["username_POST"];

        const menuUserAccess = [];
        const jml = req.body["dataAuth"].length;
        for (let i = 0; i < jml; i++) {
            menuUserAccess.push({
                id_menu: req.body["dataAuth"][i]["userprivilege_POST"],
                username: req.body["dataAuth"][i]["username_POST"]
            });
        }

        await model.adm_authentication.destroy({
            where: {
                username: username
            },
            transaction
        });

        const insertAuthMenuData = await model.adm_authentication.bulkCreate(
            menuUserAccess,
            { transaction }
        );

        if (insertAuthMenuData) {
            await transaction.commit();
            logger.info('Insert Auth By Username', {
                "1.username": `${usernameLogin}`,
                "2.module": 'insertAuthByUsername',
                "3.status": 'success',
                "4.action": req.body
            });
            return responseHelper.success(res, messages[language]?.insertData, insertAuthMenuData);
        } else {
            await transaction.rollback();
            return responseHelper.Unsuccessful(res, messages[language]?.failedData || "Insert auth failed");
        }
    } catch (error) {
        await transaction.rollback();
        return responseHelper.error(res, error, "Terjadi kesalahan saat menyimpan privilege user");
    }
};

controller.selectUsersWeb = async function (req, res) {
    try {
        const language = req.body.language_POST || 'en';
        const selectLoginData = await model.adm_user_login.findAll({
            order: [
                ['username', 'ASC'],
            ],
        });
        if (selectLoginData.length > 0) {
            return responseHelper.success(res, messages[language]?.insertData || "Users web retrieved successfully", selectLoginData);
        } else {
            return responseHelper.Unsuccessful(res, messages[language]?.nodata || "No data available", []);
        }
    } catch (error) {
        return responseHelper.error(res, error, "Terjadi kesalahan saat mengambil users web");
    }
};

controller.selectUsersMobile = async function (req, res) {
    try {
        const language = req.body.language_POST || 'en';
        const selectLoginData = await model.adm_user_login.findAll({
            where: {
                access_mobile: 1
            },
            order: [
                ['username', 'ASC'],
            ],
        });
        if (selectLoginData.length > 0) {
            return responseHelper.success(res, messages[language]?.insertData || "Users mobile retrieved successfully", selectLoginData);
        } else {
            return responseHelper.Unsuccessful(res, messages[language]?.nodata || "No data available", []);
        }
    } catch (error) {
        return responseHelper.error(res, error, "Terjadi kesalahan saat mengambil users mobile");
    }
};

controller.insertAuthCopyUser = async function (req, res) {
    const transaction = await koneksi.transaction();
    try {
        const language = req.body.language_POST || 'en';
        const usernameLogin = req.body.username_POST;
        const source = req.body.source_POST;
        const target = req.body.target_POST;

        const selectAuthsourceData = await model.adm_authentication.findAll({
            where: {
                username: source
            },
            order: [
                ['id_menu', 'ASC'],
            ],
            transaction
        });

        if (selectAuthsourceData.length === 0) {
            await transaction.rollback();
            return responseHelper.Unsuccessful(res, messages[language]?.failedData || "Source auth data not found");
        }

        await model.adm_authentication.destroy({
            where: {
                username: target
            },
            transaction
        });

        const menuUserAccess = [];
        for (let i = 0; i < selectAuthsourceData.length; i++) {
            menuUserAccess.push({
                username: target,
                id_menu: selectAuthsourceData[i].id_menu
            });
        }

        const insertAuthsourceData = await model.adm_authentication.bulkCreate(
            menuUserAccess,
            { transaction }
        );

        if (insertAuthsourceData.length > 0) {
            await transaction.commit();
            logger.info('Insert Auth Copy User', {
                "1.username": `${usernameLogin}`,
                "2.module": 'insertAuthCopyUser',
                "3.status": 'success',
                "4.action": req.body
            });
            return responseHelper.success(res, messages[language]?.insertData, insertAuthsourceData);
        } else {
            await transaction.rollback();
            return responseHelper.Unsuccessful(res, messages[language]?.failedData || "Copy auth failed");
        }
    } catch (error) {
        await transaction.rollback();
        return responseHelper.error(res, error, "Terjadi kesalahan saat menyalin privilege user");
    }
};

controller.updateWorksite = async function (req, res) {
    const transaction = await koneksi.transaction();
    try {
        const username = req.params.username;
        const language = req.body.language_POST || 'en';
        const worksite = req.body.worksite_POST;

        const updateWorksiteData = await model.adm_user_login.update(
            {
                code_company: worksite,
            },
            {
                where: {
                    username: username
                },
                transaction
            },
        );

        if (updateWorksiteData[0] > 0) {
            await transaction.commit();
            logger.info('Update Worksite', {
                "1.username": `${username}`,
                "2.module": 'updateWorksite',
                "3.status": 'success',
                "4.action": req.body
            });
            return responseHelper.success(res, messages[language]?.updateData, updateWorksiteData);
        } else {
            await transaction.rollback();
            return responseHelper.Unsuccessful(res, messages[language]?.nodata || "No data available", []);
        }
    } catch (error) {
        await transaction.rollback();
        return responseHelper.error(res, error, "Terjadi kesalahan saat memperbarui worksite");
    }
};

controller.selectAuthMobileByUsername = async function (req, res) {
    try {
        const language = req.body.language_POST || 'en';
        const username = req.body.username_POST;

        const selectAuthByUsernameData = await model.adm_authentication_mobile.findAll({
            include: [
                {
                    model: model.adm_menu_mobile,
                    include: [
                        {
                            model: model.adm_menu_mobile_translations,
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
                }
            ],
            where: {
                username: username
            },
            order: [
                ['id_menu', 'ASC'],
            ],
        });

        if (selectAuthByUsernameData.length > 0) {
            const arrIdMenu = selectAuthByUsernameData.map(auth => auth.id_menu);
            const getMenuAll = await model.adm_menu_mobile.findAll({
                include: [
                    {
                        model: model.adm_menu_mobile_translations,
                        attributes: ["translation"],
                        where: {
                            language_code: language
                        },
                    }
                ],
                where: {
                    id_menu: {
                        [Op.notIn]: arrIdMenu
                    }
                },
                order: [
                    ['id_menu', 'ASC'],
                    ['no_ordinal', 'ASC'],
                ],
            });

            const responseData = {
                dataAuth: selectAuthByUsernameData,
                dataMenu: getMenuAll,
            };

            return responseHelper.success(res, "Akun privilege anda", responseData);
        } else {
            const getMenuAll2Date = await model.adm_menu_mobile.findAll({
                include: [
                    {
                        model: model.adm_menu_mobile_translations,
                        attributes: ["translation"],
                        where: {
                            language_code: language
                        },
                    }
                ],
                order: [
                    ['id_menu', 'ASC'],
                    ['no_ordinal', 'ASC'],
                ],
            });

            const responseData = {
                dataAuth: [],
                dataMenu: getMenuAll2Date,
            };

            if (getMenuAll2Date.length > 0) {
                return responseHelper.success(res, "Retrieved all menus", responseData);
            } else {
                return responseHelper.Unsuccessful(res, messages[language]?.nodata || "No data available", responseData);
            }
        }
    } catch (error) {
        return responseHelper.error(res, error, "Terjadi kesalahan saat mengambil privilege mobile");
    }
};

controller.insertAuthMobileByUsername = async function (req, res) {
    const transaction = await koneksi.transaction();
    try {
        const username = req.body["dataAuth"][0]["username_POST"];
        const language = req.body["dataLanguage"]["language_POST"] || 'en';
        const usernameLogin = req.body["dataUsername"]["username_POST"];

        const menuUserAccess = [];
        const jml = req.body["dataAuth"].length;
        for (let i = 0; i < jml; i++) {
            menuUserAccess.push({
                id_menu: req.body["dataAuth"][i]["userprivilege_POST"],
                username: req.body["dataAuth"][i]["username_POST"]
            });
        }

        await model.adm_authentication_mobile.destroy({
            where: {
                username: username
            },
            transaction
        });

        const insertAuthMenuData = await model.adm_authentication_mobile.bulkCreate(
            menuUserAccess,
            { transaction }
        );

        if (insertAuthMenuData) {
            await transaction.commit();
            logger.info('Insert Auth Mobile By Username', {
                "1.username": `${usernameLogin}`,
                "2.module": 'insertAuthMobileByUsername',
                "3.status": 'success',
                "4.action": req.body
            });
            return responseHelper.success(res, messages[language]?.insertData, insertAuthMenuData);
        } else {
            await transaction.rollback();
            return responseHelper.Unsuccessful(res, messages[language]?.failedData || "Insert mobile auth failed");
        }
    } catch (error) {
        await transaction.rollback();
        return responseHelper.error(res, error, "Terjadi kesalahan saat menyimpan privilege mobile");
    }
};

controller.insertAuthCopyUserMobile = async function (req, res) {
    const transaction = await koneksi.transaction();
    try {
        const language = req.body.language_POST || 'en';
        const usernameLogin = req.body.username_POST;
        const source = req.body.source_POST;
        const target = req.body.target_POST;

        const selectAuthsourceData = await model.adm_authentication_mobile.findAll({
            where: {
                username: source
            },
            order: [
                ['id_menu', 'ASC'],
            ],
            transaction
        });

        if (selectAuthsourceData.length === 0) {
            await transaction.rollback();
            return responseHelper.Unsuccessful(res, messages[language]?.failedData || "Source auth data not found");
        }

        await model.adm_authentication_mobile.destroy({
            where: {
                username: target
            },
            transaction
        });

        const menuUserAccess = [];
        for (let i = 0; i < selectAuthsourceData.length; i++) {
            menuUserAccess.push({
                username: target,
                id_menu: selectAuthsourceData[i].id_menu
            });
        }

        const insertAuthsourceData = await model.adm_authentication_mobile.bulkCreate(
            menuUserAccess,
            { transaction }
        );

        if (insertAuthsourceData.length > 0) {
            await transaction.commit();
            logger.info('Insert Auth Copy User Mobile', {
                "1.username": `${usernameLogin}`,
                "2.module": 'insertAuthCopyUserMobile',
                "3.status": 'success',
                "4.action": req.body
            });
            return responseHelper.success(res, messages[language]?.insertData, insertAuthsourceData);
        } else {
            await transaction.rollback();
            return responseHelper.Unsuccessful(res, messages[language]?.failedData || "Copy auth failed");
        }
    } catch (error) {
        await transaction.rollback();
        return responseHelper.error(res, error, "Terjadi kesalahan saat menyalin privilege mobile");
    }
};

module.exports = controller;