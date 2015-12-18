function onload(){
  $.getJSON("/dashboard/idcounter", idcounter);
  $.getJSON("/dashboard/pending", pending);
  $.getJSON("/dashboard/archived", archived);
  $.getJSON("/dashboard/users", users);
  $.getJSON("/dashboard/tags", tags);
  $.getJSON("/dashboard/images", images);
}

var idcounter = function idcounter(json){
  var div = document.getElementById("idcounter");
  div.innerHTML = "Number of items: " + json[0].idCounter;
}

var pending = function pending(json){
  var div = document.getElementById("pending");
  var per = Math.round(json[0].completed*100/(json[0].pending+json[0].completed));
  div.innerHTML = "Number of pending items: " + json[0].pending
                + "<br/>Number of completed items: " + json[0].completed
                + "<br/>Percentage completed: " + per + "%<br/><br/>";
  div.innerHTML += percentageBar(per);
}

var archived = function archived(json){
  var div = document.getElementById("archived");
  var per = Math.round(json[0].archived*100/(json[0].active+json[0].archived));
  div.innerHTML = "Number of archived items: " + json[0].archived
                + "<br/>Number of active items: " + json[0].active
                + "<br/>Percentage archived: " + per + "%<br/><br/>";
  div.innerHTML += percentageBar(per);
}

var users = function users(json){
  var div = document.getElementById("users");
  div.innerHTML = "Number of users: " + json[0].users;
}

var tags = function tags(json){
  var div = document.getElementById("tags");
  for(var i = 0; i < json.length; i++){
    div.innerHTML += "<br/>" + json[i].tag;
  }
}

var images = function images(json){
  var div = document.getElementById("allimages");
  for(var i = 0; i < json.length; i++){
    div.innerHTML += "<img src=\"" + json[i].pic + "\"</img>";
  }
}

function percentageBar(percent){
  return("<div class=\"percentage-base\"><div class=\"percentage-body\" style=\"width: " + percent +"%\"></div></div>");
}
