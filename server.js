var express = require('express'),
    path = require('path'),
    MongoClient = require("mongodb").MongoClient,
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    cors = require('cors'),

// API file for interacting with MongoDB
    config = require('./server/config/config'); // importing config file



var app = express();

// var http = require('http');
// var nodemailer = require('nodemailer');
// var connect = require('connect');
// var app = connect();


app.use(function (req, res, next) {


    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();



// res.header('Access-Control-Allow-Origin', '*');
// res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
// res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');


});


//app.use(fileUpload()); / Parsers
app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true }));
app.use(express.static('./images/'));



var originsWhitelist = [
    'http://localhost:4200',
    'http://localhost:8101',
    'http://localhost:8080',
    'http://192.168.225.37:8101'

//this is my front-end url for development
];



var corsOptions = {
    origin: function (origin, callback) {
        var isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
        callback(null, isWhitelisted);
    },
    credentials: true
};
//here is the cors magic
app.use(cors(corsOptions));

//app.use(express.static('./images/'));

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;



// Connect to the database before starting the application server.
MongoClient.connect(config.CONNECTION_URL,{ useUnifiedTopology: true, useNewUrlParser: true }, function (err, client) {
    if (err) {
        console.log("Database connection error",err);
        //throw err
    } else {
// Save database object from the callback for reuse.
        db = client.db(config.DATABASE_NAME);
        console.log("Database connection ready");
        require('./routes')(app, db);

// Point static path to dist
        app.use(express.static(path.join(__dirname, 'dist')));

// Catch all other routes and return the index file
        app.get('*', function (req, res) {
            res.sendFile(path.join(__dirname, 'dist/index.html'));
        });

// Initialize the app
        var server = app.listen(process.env.PORT || 9000, function () {
            var port = server.address().port;
            console.log("App now running on http://localhost", + port);
        });
    }

});
