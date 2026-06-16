const jwt = require('jsonwebtoken');
const responseHelper = require('../helpers/responseHelper');

const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return responseHelper.unauthorized(res, "Access token required");
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return responseHelper.unauthorized(res, "Access token required");
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return responseHelper.unauthorized(res, "Invalid access token");
    }
};

module.exports = verifyToken;