const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const { Server } = require('socket.io');

const validateToken = require('./middleware/verifyToken');
const { notFound, error, internalServerError } = require('./helpers/responseHelper');

const app = express();
const server = http.createServer(app);
const agents = new Map();
/* =========================================
   SOCKET.IO
========================================= */
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

/* =========================================
   CORS
========================================= */
const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

/* =========================================
   BODY PARSER (LARGE PAYLOAD SUPPORT)
========================================= */
app.use(express.json({
    limit: '100mb'
}));

app.use(express.urlencoded({
    extended: true,
    limit: '100mb'
}));

/* =========================================
   MIDDLEWARE
========================================= */
app.use(logger('dev'));
app.use(cookieParser());

/* =========================================
   PAYLOAD SIZE LOG
========================================= */
app.use((req, res, next) => {
    const contentLength = req.headers['content-length'];

    if (contentLength) {
        console.log(
            `Payload Size : ${(contentLength / 1024 / 1024).toFixed(2)} MB`
        );
    }

    next();
});

/* =========================================
   STATIC FILES
========================================= */
app.use(express.static(path.join(__dirname, 'public')));

app.use(
    '/img/employee',
    express.static(path.join(__dirname, 'assets/image/employee'))
);

app.use(
    '/log',
    express.static(path.join(__dirname, 'assets/log'))
);

app.use(
    '/file',
    express.static(path.join(__dirname, 'public/file/attendance'))
);

app.use(
    '/sign',
    express.static(path.join(__dirname, 'public/file/signature'))
);

/* =========================================
   VIEW ENGINE
========================================= */
app.set('view engine', 'ejs');

/* =========================================
   VIEW ROUTES
========================================= */
app.get('/', (req, res) => {
    res.render('pages/index');
});

app.get('/login', (req, res) => {
    res.render('pages/login');
});

app.get('/company', (req, res) => {
    res.render('pages/company');
});

app.get('/menu_directory', (req, res) => {
    res.render('pages/menu_directory');
});

app.get('/users', (req, res) => {
    res.render('pages/users');
});

app.get('/language', (req, res) => {
    res.render('pages/language');
});

app.get('/internal_ffb', (req, res) => {
    res.render('pages/internal_ffb');
});

app.get('/external_ffb', (req, res) => {
    res.render('pages/external_ffb');
});

app.get('/mill_activation', (req, res) => {
    res.render('pages/mill_activation');
});
app.get('/vehicle_number', (req, res) => {
    res.render('pages/vehicle_number');
});
app.get('/partners', (req, res) => {
    res.render('pages/partners');
});

/* =========================================
   API ROUTES
========================================= */
const routes = [
    ['/', require('./routes/index')],
    ['/menu', require('./routes/menu')],
    ['/login', require('./routes/login')],
    ['/language', require('./routes/language')],
    ['/translate', require('./routes/translate')],
    ['/users', require('./routes/users')],
    ['/employee', require('./routes/employee')],
    ['/millactivation', require('./routes/mill_activation')],
    ['/company', require('./routes/company')],
    ['/vehiclenumber', require('./routes/vehicle_number')],
    ['/weightbridge', require('./routes/weight_bridge')],
    ['/printticket', require('./routes/print_ticket')],
    ['/partners', require('./routes/partners')],
    ['/download-test-file.bin', require('./routes/download')],
    // [
    //     '/protected-route',
    //     validateToken,
    //     (req, res) => {
    //         res.json({
    //             message: 'Access granted',
    //             user: req.user
    //         });
    //     }
    // ]
];

routes.forEach(([routePath, ...middleware]) => {
    app.use(routePath, ...middleware);
});

/* =========================================
   404 HANDLER
========================================= */
app.use((req, res) => {
    return notFound(
        res,
        'Endpoint not found or method is not allowed'
    );
});

/* =========================================
   ERROR HANDLER
========================================= */
app.use((err, req, res, next) => {

    console.error(err);

    if (err.type === 'entity.too.large') {
        return res.status(413).json({
            success: false,
            message: 'Payload too large'
        });
    }

    const statusCode = err.status || 500;
    const errorMessage =
        err.message || 'An unexpected error occurred';

    if (statusCode === 500) {
        return internalServerError(
            res,
            'An unexpected error occurred on the server',
            req.app.get('env') === 'development'
                ? err.message
                : null
        );
    }

    return error(res, errorMessage, statusCode);
});

/* =========================================
   SOCKET EVENTS
========================================= */
io.on('connection', (socket) => {
    console.log('Socket Connected:', socket.id);

    socket.on('weightFromScale', (data) => {
        console.log('Weight Receive:', data);
        io.emit('weightUpdate', data);
    });

    socket.on("registerAgent", (data) => {

        agents.set(data.scaleId, socket.id);

        console.log(
            `Agent ${data.scaleId} registered (${socket.id})`
        );

    });
    socket.on("getPrinters", (data, callback) => {

        const agentSocketId = agents.get(data.scaleId);

        if (!agentSocketId) {
            return callback({
                success: false,
                message: "Agent Offline"
            });
        }

        io.to(agentSocketId)
            .timeout(10000)
            .emit("requestPrinters", data, (err, responses) => {

                if (err) {
                    return callback({
                        success: false,
                        message: "Agent Timeout"
                    });
                }

                callback(responses[0]);

            });

    });
    socket.on("printTicketTBSInti", (data, callback) => {
        const agentSocketId = agents.get(data.scaleId);
        if (!agentSocketId) {
            return callback({
                success: false,
                message: "Agent Offline"
            });
        }
        io.to(agentSocketId)
            .timeout(30000)
            .emit(
                "requestPrintTicketTBSInti",
                data,
                (err, responses) => {

                    if (err) {

                        return callback({
                            success: false,
                            message: "Agent Timeout"
                        });

                    }

                    callback(responses[0]);

                }
            );

    });

    socket.on('disconnect', () => {
        console.log('Socket Disconnect:', socket.id);
        if (socket.scaleId) {
            agents.delete(socket.scaleId);
            console.log(`Agent ${socket.scaleId} removed from registry.`);
        }
    });
});

/* =========================================
   SERVER START
========================================= */
const PORT = process.env.PORT || 8084;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});