var http = require("http");
var ejs = require('ejs');
var express = require("express");
var app = express();
require('./routes.js')(app);
require("./database.js");
var idCounter = 0;

//create server and set templates
http.createServer(app).listen(80);
app.use(express.static('static'));

app.set('views', __dirname + '/static/views');
app.set('view engine', 'ejs');
