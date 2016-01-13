var url = require("url");

module.exports = function(app){

  app.get("/splash", function(req, res){
    res.render("splash");
  });

  app.get("/dashboard", function(req, res){
    res.render("dashboard");
  });

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

  //dashboard page
  app.get("/dash(board)?/:type", function(req, res){
    var type = req.params.type;
    res.writeHead(200);
    dashboard(type, function(result){
      res.end(JSON.stringify(result));
    });
  });

  //auth

};
