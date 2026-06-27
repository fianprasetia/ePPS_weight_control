const jwt = require('jsonwebtoken');
const messages = require("../controller/message");
const model = require('../models/index');
const responseHelper = require('../helpers/responseHelper');

const validateToken = async (req, res, next) => {
    const language = "en";
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader) {
            return responseHelper.unauthorized(res, messages[language]?.userToken);
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return responseHelper.unauthorized(res, messages[language]?.userToken);
        }

        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        const username = decoded["username"];

        const storedToken = await model.adm_user_token.findOne({
            where: { token: token }
        });

        if (!storedToken) {
            return responseHelper.unauthorized(res, messages[language]?.userIlegal);
        }

        if (new Date() > storedToken.expired_at) {
            await model.adm_user_token.destroy({
                where: {
                    username: username
                }
            });
            return responseHelper.unauthorized(res, messages[language]?.userSession);
        }

        req.user = decoded;
        next();
    } catch (error) {
        return responseHelper.unauthorized(res, messages[language]?.userSession);
    }
};

module.exports = validateToken;
