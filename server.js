var http = require("http");
var express = require("express");
var url = require("url");
var mysql = require("mysql");
var app = express();
var idCounter = 0;

//create server and set templates
http.createServer(app).listen(8080);
app.use(express.static('static'));

//set databse connection variables
var connection = mysql.createConnection({
  host     : "localhost",
  user     : "root",
  password : "webdata",
  database : "todo"
});

//connect to database
connection.connect(function(err) {
  console.log("Connected to database");
});

//check for errors
var addToDatabase = function(err, result) {
  if (!err){
    console.log("item added");
  } else {
    console.log("error with database connection: " + err);
  }
}

//change content in database
app.get("/change", function(req, res){
  console.log("change request");
  res.writeHead(200);
  var query = url.parse(req.url, true).query;

  (query["priority"] == "true") ? query["priority"] = true : query["priority"] = false;
  (query["done"] == "true") ? query["done"] = true : query["done"] = false;
  (query["archived"] == "true") ? query["archived"] = true : query["archived"] = false;

  query["idCounter"]++;

  var itemQuery = "UPDATE ToDoItem SET Title=\""+query["title"]+"\", Text=\""+query["text"]+"\", Pic=\""+query["pic"]+"\", "
                 +"DueDate=\""+query["date"]+"\", Completed="+query["done"]+", Priority="+query["priority"]+", Archived="+query["archived"]
                 +" WHERE Id="+query["idCounter"];

  var tagQuery = "UPDATE Tag SET Text=\""+query["tags"]+"\" WHERE Id="+query["idCounter"];

  connection.query(itemQuery, addToDatabase);
  connection.query(tagQuery, addToDatabase);

  res.end();
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

  connection.query(itemQuery, addToDatabase);
  connection.query(tagQuery, addToDatabase);
  connection.query(itemTagQuery, addToDatabase);
  res.end();
});

//get contents from database and return them
app.get("/get", function(req, res){
  console.log("get request");
  res.writeHead(200);
  var getQuery = "SELECT Title AS title, ToDoItem.Text AS text, Pic AS pic, Tag.Text AS tags,"
               + "DueDate AS date, Priority AS priority, Completed AS done, Archived AS archived, ToDoItem.Id-1 AS idCounter "
               + "FROM ToDoItem, ItemTag, Tag "
               + "WHERE ToDoItem.Id=ItemTag.ToDoId AND ItemTag.TagId=Tag.Id";
  connection.query(getQuery, function(err, result) {
    if (!err){
      idCounter = result.length;
      console.log("Database returned, idCounter: " + idCounter);
      for(var i = 0; i < result.length; i++){
        (result[i].priority == 1) ? result[i].priority = true : result[i].priority = false;
        (result[i].done == 1) ? result[i].done = true : result[i].done = false;
        (result[i].archived == 1) ? result[i].archived = true : result[i].archived = false;
        res.end(JSON.stringify(result));
      }
      res.end();
    } else {
      console.log("error while setting: " + err);
    }
  });
});
