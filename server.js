var http = require("http");
var url = require("url");
var ejs = require('ejs');
var express = require("express");
var app = express();
require('./routes.js')(app);
require("./database.js");
require("./twitter.js");
var idCounter = 0;
var user = "none";
var passport = require("passport");

//create server and set templates
http.createServer(app).listen(8080);
app.use(express.static('static'));

app.set('views', __dirname + '/static/views');
app.set('view engine', 'ejs');

app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());


//Authentication

app.get('/auth/twitter',
  passport.authenticate('twitter'));

app.get('/test-login',
  passport.authenticate('twitter', { failureRedirect: '/failure' }),
  function(req, res) {
    res.redirect('/');
  }
);

app.get("/success", function (req, res) {
  console.log("Success!");
  console.log(req.user.username);
});

app.get("/failure", function (req, res) {
  console.log("Failure!");
  res.send("User login via Twitter was unsuccessful!");
});

app.get("/", function(req, res){
  if(req.user.username){
    console.log(req.user.username+" logged in!")
    res.render("todos", { title: req.user.username });
  } else {
    res.render("todos", { title: "user" });
  }
});

//add content to database
app.get("/set", function(req, res){
  console.log("set request");
  res.writeHead(200);
  var query = url.parse(req.url, true).query;

  (query["priority"] == "true") ? query["priority"] = true : query["priority"] = false;
  (query["done"] == "true") ? query["done"] = true : query["done"] = false;
  (query["archived"] == "true") ? query["archived"] = true : query["archived"] = false;

  var itemQuery = "INSERT INTO ToDoItem (Title, Text, Pic, DueDate, Completed, Priority, Archived) VALUES (\""
                 + query["title"] + "\",\"" + query["text"] + "\",\"" + query["pic"] + "\",\"" + query["date"] + "\","
                 + query["done"] + "," + query["priority"] + "," + query["archived"] + ")";

  var tagQuery = "INSERT INTO Tag (Text) VALUES (\"" + query["tags"] + "\")";

  idCounter++;
  var itemTagQuery = "INSERT INTO ItemTag (ToDoId, TagId) VALUES (" + idCounter + ", " + idCounter + ")";
  var userQuery = "INSERT INTO User (Username) VALUES (\""+req.user.username+"\")";

  set(userQuery, itemQuery, tagQuery, itemTagQuery);
  res.end();
});

//get contents from database and return them
app.get("/get", function(req, res){
  console.log("get request");
  res.writeHead(200);
  get(req.user.username, function(result){
    idCounter = result.length;
    res.end(JSON.stringify(result));
  });
});
