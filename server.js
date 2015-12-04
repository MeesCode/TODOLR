var http = require("http");
var express = require("express");
var url = require("url");
var app = express();
var idCounter = 0;

http.createServer(app).listen(8080);
app.use(express.static('static'));

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

app.get("/change", function(req, res){
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
  res.writeHead(200);
  var query = url.parse(req.url, true).query;
  idCounter = array.length;

  (query["priority"] == "true") ? query["priority"] = true : query["priority"] = false;
  (query["done"] == "true") ? query["done"] = true : query["done"] = false;
  (query["archived"] == "true") ? query["archived"] = true : query["archived"] = false;

  array.push(new item(query["title"], query["text"], query["pic"],
                      query["tags"], query["date"], query["priority"],
                      query["done"], query["archived"], idCounter));
  res.end();
});

app.get("/get", function(req, res){
  res.writeHead(200);
  res.end(JSON.stringify(array));
});
