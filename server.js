process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var mongoose = require('./config/mongoose'),
	express = require('./config/express'),
	passport = require('./config/passport');

var db = mongoose();
var app = express();
var passport = passport();

app.listen(5000);
module.exports = app;


console.log("server running on port 5000");
