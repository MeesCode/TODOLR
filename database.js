var mysql = require("mysql");

//set databse connection variables
var connection = mysql.createConnection({
  host     : "localhost",
  user     : "root",
  password : "merel4840",
  database : "todo"
});

//check for errors
var addToDatabase = function(err, result) {
  if (!err){
    console.log("item added");
  } else {
    console.log("error with database connection: " + err);
  }
}

//connect to database
connection.connect(function(err) {
  console.log("Connected to database");
});

set = function(userQuery, itemQuery, tagQuery, itemTagQuery){
  connection.query(userQuery, addToDatabase);
  connection.query(itemQuery, addToDatabase);
  connection.query(tagQuery, addToDatabase);
  connection.query(itemTagQuery, addToDatabase);
}

change = function(itemQuery, tagQuery, itemTagQuery){
  connection.query(itemQuery, addToDatabase);
  connection.query(tagQuery, addToDatabase);
}

get = function(username, callback){
  var query = "SELECT Title AS title, ToDoItem.Text AS text, Pic AS pic, Tag.Text AS tags,"
               + "DueDate AS date, Priority AS priority, Completed AS done, Archived AS archived, ToDoItem.Id-1 AS idCounter "
               + "FROM ToDoItem, ItemTag, Tag, User "
               + "WHERE ToDoItem.Id=ItemTag.ToDoId AND ItemTag.TagId=Tag.Id AND User.Id=ToDoItem.Id AND User.Username=\""+username+"\"";
  connection.query(query, function(err, result) {
    if (!err){
      idCounter = result.length;
      console.log("Database returned");
      for(var i = 0; i < result.length; i++){
        (result[i].priority == 1) ? result[i].priority = true : result[i].priority = false;
        (result[i].done == 1) ? result[i].done = true : result[i].done = false;
        (result[i].archived == 1) ? result[i].archived = true : result[i].archived = false;
      }
      callback(result);
    } else {
      console.log("error while getting: " + err);
      callback();
    }
  });
}

dashboard = function(type, callback){
  if(type == "idcounter"){
    console.log("dashboard request: idCounter");
    var query = "SELECT COUNT(*) AS idCounter FROM ToDoItem";
  }
  if(type == "pending"){
    console.log("dashboard request: pending");
    var query = "SELECT SUM(Completed) AS completed, COUNT(*)-SUM(Completed) AS pending FROM ToDoItem";
  }
  if(type == "archived"){
    console.log("dashboard request: archived");
    var query = "SELECT SUM(Archived) AS archived, COUNT(*)-SUM(Archived) AS active FROM ToDoItem";
  }
  if(type == "users"){
    console.log("dashboard request: users");
    var query = "SELECT COUNT(*) AS users FROM User";
  }
  if(type == "tags"){
    console.log("dashboard request: tags");
    var query = "SELECT DISTINCT Text AS tag FROM Tag WHERE Text <> \"\"";
  }
  if(type == "images"){
    console.log("dashboard request: images");
    var query = "SELECT DISTINCT Pic AS pic FROM ToDoItem WHERE Pic <> \"\"";
  }
  if(type == "clearDatabase"){
    console.log("dashboard request: clear database");
    var query = "source /home/mees/todolr/TODOLR\\ Database.sql";
  }
  connection.query(query, function(err, result) {
    if (!err){
      console.log("Database returned");
      callback(result);
    } else {
      console.log("error while getting dashboard info");
      console.log("query: " + query);
      console.log("error message: " + err);
      callback();
    }
  });
}
