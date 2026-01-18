const createError = require('http-errors');
var express = require('express');
// var app = express();
var path = require('path')
var cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require("body-parser");
var cors = require('cors');
const cluster = require('cluster');
const os = require('os');
const numCPUs = os.cpus().length;
const rateLimit = require('express-rate-limit');
const { authorize } = require('./public/lib/authorize');


if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
    });

} else {
    const validateToken = require('./middleware/verifyToken');
    var app = express();
    const corsOptions = {
        origin: '*', // Ganti dengan origin yang tepat
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        exposedHeaders: [], // header tambahan yang ingin diexpose ke client
        credentials: false // set true jika menggunakan cookies/session
    };
    app.use(cors(corsOptions));
    app.options('*', cors(corsOptions));

    // const limiter = rateLimit({
    //     windowMs: 5 * 60 * 1000, // 5 minutes
    //     max: 100,
    //     message: "Too many requests from this IP, please try again later.",
    // });
    app.use(bodyParser.json());
    // app.use(limiter);

    app.use(logger('dev'));

    // app.use(bodyParser.json());
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));

    app.use(cookieParser());

    app.use(express.static(path.join(__dirname, 'public')));
    app.use('/img/employee', express.static(path.join(__dirname, 'assets/image/employee')));
    app.use('/log', express.static(path.join(__dirname, 'assets/log')))


    app.set('view engine', 'ejs');
    // app.use(express.static(path.join(__dirname, 'public')));
    app.use(cookieParser());
    // app.use(express.json());
    // app.use(express.urlencoded({ extended: false }));
    app.use(express.json({ limit: '100mb' }));
    app.use(express.urlencoded({ extended: true, limit: '100mb' }));
    app.use(express.static(path.join(__dirname, 'public')));
    app.use('/file', express.static(path.join(__dirname, 'public/file/attendance')));
    app.use('/sign', express.static(path.join(__dirname, 'public/file/signature')));



    app.get('/', function (req, res) {
        res.render('pages/index');
    });
    app.get('/login', function (req, res) {
        res.render('pages/login');
    });
    app.get('/login', function (req, res) {
        res.render('pages/login');
    });
    app.get('/menu_directory', function (req, res) {
        res.render('pages/menu_directory');
    });

    const routes = [
        ['/', require('./routes/index')],
        ['/menu', require('./routes/menu')],
        ['/login', require('./routes/login')],
        ['/language', require('./routes/language')],
        ['/translate', require('./routes/translate')],
        ['/download-test-file.bin', require('./routes/download')],
        ['/protected-route', validateToken, (req, res) => res.json({ message: 'Access granted', user: req.user })]

    ];

    routes.forEach(([path, ...middleware]) => {
        app.use(path, ...middleware);
    });

    // 404 handler
    app.use((req, res, next) => {
        next(createError(404));
    });

    // Error handler
    app.use((err, req, res, next) => {
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};
        res.status(err.status || 500);
        res.json({ error: err.message });
    });

    const PORT = process.env.PORT || 8084;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}