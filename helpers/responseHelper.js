function buildEnvelope({
    success,
    message,
    data = null,
    error = null,
    meta = null,
    requestId = null,
}) {
    return {
        success,
        message,
        ...(requestId && { requestId }),
        ...(data !== null && { data }),
        ...(error !== null && { error }),
        ...(meta !== null && { meta }),
    };
}

function send(
    res,
    { statusCode = 200, success = true, message = '', data = null, error = null, meta = null }
) {
    if (res.headersSent) {
        return;
    }

    const requestId = res.locals?.requestId || null;
    return res
        .status(statusCode)
        .json(buildEnvelope({ success, message, data, error, meta, requestId }));
}

exports.send = send;

exports.success = (res, message, data = null, meta = null) =>
    send(res, {
        statusCode: 200,
        success: true,
        message,
        data,
        meta,
    });

exports.Unsuccessful = (res, message, data = null) =>
    send(res, {
        statusCode: 200,
        success: false,
        message,
        data,
    });

exports.created = (res, message, data = null) =>
    send(res, {
        statusCode: 201,
        success: true,
        message,
        data,
    });

exports.failed = (res, message, data = null) =>
    send(res, {
        statusCode: 400,
        success: false,
        message,
        data,
    });

exports.validationError = (res, message = 'Validation error', details = []) =>
    send(res, {
        statusCode: 422,
        success: false,
        message,
        error: {
            code: 'VALIDATION_ERROR',
            details,
        },
    });

exports.unauthorized = (res, message = 'Unauthorized') =>
    send(res, {
        statusCode: 401,
        success: false,
        message,
        error: { code: 'UNAUTHORIZED' },
    });

exports.forbidden = (res, message = 'Forbidden') =>
    send(res, {
        statusCode: 403,
        success: false,
        message,
        error: { code: 'FORBIDDEN' },
    });

exports.notFound = (res, message = 'Data not found') =>
    send(res, {
        statusCode: 404,
        success: false,
        message,
        error: { code: 'NOT_FOUND' },
    });

exports.conflict = (res, message = 'Duplicate data') =>
    send(res, {
        statusCode: 409,
        success: false,
        message,
        error: { code: 'CONFLICT' },
    });

exports.error = (res, error, defaultMessage = 'Internal server error') => {
    const statusCode = error?.statusCode || 500;
    const message = error?.message || defaultMessage;
    const code = error?.code || 'INTERNAL_SERVER_ERROR';

    if (statusCode >= 500) {
        console.error(error);
    }

    return send(res, {
        statusCode,
        success: false,
        message,
        error: {
            code,
            details: error?.details || null,
        },
    });
};
