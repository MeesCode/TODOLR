require("./database.js");

var http = require("http");
var express = require("express");
var url = require("url");
var app = express();
var idCounter = 0;

//create server and set templates
http.createServer(app).listen(8080);
app.use(express.static('static'));

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

  set(itemQuery, tagQuery);

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

  set(itemQuery, tagQuery, itemTagQuery);
  res.end();
});

//get contents from database and return them
app.get("/get", function(req, res){
  console.log("get request");
  res.writeHead(200);
  get(function(result){
    idCounter = result.length;
    res.end(JSON.stringify(result));
  });
});

//dashboard page
app.get("/dashboard/:type", function(req, res){
  var type = req.params.type;
  res.writeHead(200);
  dashboard(type, function(result){
    res.end(JSON.stringify(result));
  });
});
