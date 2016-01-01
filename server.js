var http = require("http");
var express = require("express");
var app = express();
require('./routes.js')(app);
require("./database.js");
var idCounter = 0;

//create server and set templates
http.createServer(app).listen(8080);
app.use(express.static('static'));
