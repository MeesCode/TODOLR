var http = require("http");
var express = require("express");
var url = require("url");
var mysql = require("mysql");
var app = express();
var idCounter = 1;

http.createServer(app).listen(8080);
app.use(express.static('static'));

var connection = mysql.createConnection({
  host     : "localhost",
  user     : "root",
  password : "",
  database : "todo"
});

connection.connect(function(err) {
  console.log("Connected to database");
});

var array = [];

function item(title, text, pic, tags, date, priority, done, archived, idCounter){
  this.title = title;
  this.text = text;
  this.pic = pic;
  this.tags = tags;
  this.date = date;
  this.priority = priority;
  this.done = done;
  this.archived = archived;
  this.idCounter = idCounter;
}

var getQuery = "SELECT Title AS title, ToDoItem.Text AS text, Pic AS pic, Tag.Text AS tags,"
             + "DueDate AS date, Priority AS priority, Completed AS done, Archived AS archived, ToDoItem.Id-1 AS idCounter "
             + "FROM ToDoItem, ItemTag, Tag "
             + "WHERE ToDoItem.Id=ItemTag.ToDoId AND ItemTag.TagId=Tag.Id";

var getFromDatabase = function(err, result) {
  if (!err){

    if(idCounter){
      idCounter = result[result.length-1].idCounter + 1;
    }
    console.log("Database returned, idCounter: " + idCounter);

    for(var i = 0; i < result.length; i++){
      (result[i].priority == 1) ? result[i].priority = true : result[i].priority = false;
      (result[i].done == 1) ? result[i].done = true : result[i].done = false;
      (result[i].archived == 1) ? result[i].archived = true : result[i].archived = false;
      array = result;
    }

  } else {
    console.log("error with database connection: " + err);
  }
}

var addToDatabase = function(err, result) {
  if (!err){
    console.log("item added");
  } else {
    console.log("error with database connection: " + err);
  }
}

app.get("/change", function(req, res){
  console.log("change request");
  res.writeHead(200);
  var query = url.parse(req.url, true).query;

  (query["priority"] == "true") ? query["priority"] = true : query["priority"] = false;
  (query["done"] == "true") ? query["done"] = true : query["done"] = false;
  (query["archived"] == "true") ? query["archived"] = true : query["archived"] = false;

  array[query["idCounter"]] = (new item(query["title"], query["text"], query["pic"],
                      query["tags"], query["date"], query["priority"],
                      query["done"], query["archived"], query["idCounter"]));
  res.end();
});

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

  console.log(itemTagQuery);
  connection.query(itemQuery, addToDatabase);
  connection.query(tagQuery, addToDatabase);
  connection.query(itemTagQuery, addToDatabase);
  res.end();
});

app.get("/get", function(req, res){
  console.log("get request");
  res.writeHead(200);
  connection.query(getQuery, getFromDatabase);
  res.end(JSON.stringify(array));
});
