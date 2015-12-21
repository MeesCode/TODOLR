
function masonry(){
  var $content = $('#items');
  $content.masonry("reloadItems");
	$content.masonry({
		columnWidth: 340,
		itemSelector: '.item',
		gutter: 20
	});
}


//initialize variables when page loads
function onload(){
  array = new arrayList();
  get();
}

var get = function get(){
  $.getJSON("/get", saveArray);
}

var getNone = function getNone(){
  $.getJSON("/get", saveArrayNone);
}

var placeNewItem = function placeNewItem(i){
    remove(i);
    $.getJSON("/get", get);
    if(!array.get(i).archived){
      place(array.get(i));
    }
    masonry();
}

var refresh = function refresh(){
  removeAll();
  placeAll();

  masonry();
}

//add an item
function newItem(){
  var form = document.getElementById("newItem");

  //create item object
  $.get("/set", {"title":form[0].value,
                 "text":form[1].value,
                 "pic":form[2].value,
                 "tags":form[3].value,
                 "date":form[4].value,
                 "priority":form[5].checked,
                 "done":false, "archived":false}, get);
}

var saveArray = function saveArray(json){
  array = new arrayList();
  for(var i = 0; i < json.length; i++){
    array.set(json[i]);
  }
  refresh();
}

var saveArrayNone = function saveArrayNone(json){
  array = new arrayList();
  for(var i = 0; i < json.length; i++){
    array.set(json[i]);
  }
}

//archive an item
function toggleArchive(i){
  array.toggleArchive(i);
  changeItem(i, false);
}

//remove all items from screen (don't archive them)
function removeAll(){
  var content = document.getElementById("content");
  while (content.firstChild) {
    content.removeChild(content.firstChild);
  }
}

function remove(id) {
  var content = document.getElementById("content");
  var div = document.getElementById(id);
  content.removeChild(div);
}

//filter on tag
function filterTag(){
  removeAll();
  for(var i = 0; i < array.getLength(); i++){
    //if query is the same as tag
    if(array.get(i).tags == document.getElementById("tagQuery").value && !array.get(i).archived){
      place(array.get(i));
    }
  }
}

//show only items with priority
function filterPriority(){
  removeAll();
  for(var i = 0; i < array.getLength(); i++){
    if(array.get(i).priority && !array.get(i).archived){
      place(array.get(i));
    }
  }
  masonry();
}

//buble sort on date
function sortDate(reverse){
  removeAll();
  temp = [];
  var max = 0;

  //put all items in a temporary array
  for(var i = 0; i < array.getLength(); i++){
    if(!array.get(i).archived){
      temp.push(array.get(i));
    }
  }

  //bubble sort
  var swapped = true;
  while(swapped){
      swapped = false;
      for(var i = 0; i < temp.length-1; i++) {
          if(new Date(temp[i].date).getTime() > new Date(temp[i+1].date).getTime()) {
            var tempObj = temp[i];
            temp[i] = temp[i+1];
            temp[i+1] = tempObj;
            swapped = true;
          }
      }
  }

  //normally bubble sort sorts in the wrong order
  //don't reverse when you want that
  if(!reverse){
    temp.reverse();
  }

  //put items on screen
  for (var i = 0; i < temp.length; i++){
  	if(temp[i].date != ""){
    	place(temp[i]);
    }
  }
  masonry();

}

//place all non-archived items on screen
function placeAll(){
  removeAll();
  for(var i = 0; i < array.getLength(); i++){
    if(!array.get(i).archived){
      place(array.get(i));
    }
  }
}

//place only archived items on screen
function placeArchived(){
  getNone();
  removeAll();
  for(var i = 0; i < array.getLength(); i++){
    if(array.get(i).archived){
      place(array.get(i));
    }
  }
  masonry();
}

//change an item to it's current form (executed when item is deselected)
function changeItem(i, place){

  var title = document.getElementById(i).getElementsByClassName("title")[0].value;
  var text = document.getElementById(i).getElementsByClassName("text")[0].value;
  var pic = document.getElementById(i).getElementsByClassName("picbox")[0].value;
  var tags = document.getElementById(i).getElementsByClassName("tags")[0].value;
  var date = document.getElementById(i).getElementsByClassName("date")[0].value;
  var priority = document.getElementById(i).getElementsByClassName("priority")[0].checked;
  var done = document.getElementById(i).getElementsByClassName("done")[0].checked;
  var archived = array.get(i).archived;

  if(place){
    $.get("/change", {"idCounter":i, "title":title, "text":text, "pic":pic, "tags":tags, "date":date, "priority":priority, "done":done, "archived":archived}, placeNewItem(i));
  } else {
    $.get("/change", {"idCounter":i, "title":title, "text":text, "pic":pic, "tags":tags, "date":date, "priority":priority, "done":done, "archived":archived});
    remove(i);
    masonry();
  }
}

//arraylist t hold items
function arrayList(){
  var array1 = [];

  //get an item from the array
  this.get = function (i){
    return array1[i];
  }

  //add a new item
  this.set = function (i){
    array1.push(i);
  }


  //toggle archived item
  this.toggleArchive = function (i){
    array1[i].archived = !array1[i].archived;
  }

  //get amount of items (even archived)
  this.getLength = function (){
    return array1.length;
  }
}

//clear new item input fields
function reset(){
  var form = document.getElementById("newItem");

  form.getElementsByClassName("title")[0].value = "";
  form.getElementsByClassName("text")[0].value = "";
  form.getElementsByClassName("pic")[0].value = "";
  form.getElementsByClassName("tags")[0].value = "";
  form.getElementsByClassName("date")[0].value = "";
  form.getElementsByClassName("checkbox")[0].checked = false;
}

//place an item on the screen
function place(item){
  var content = document.getElementById("content");

  //give all items a id with the same name as their item id's
  var div = document.createElement("div");
  div.className = "item";
  div.id = item.idCounter;

  var tempDate = new Date();
  if(new Date(item.date).getTime() < tempDate.getTime() && !item.done){
    div.className += " itemOverdue";
  }
  if(item.done){
    div.className += " itemDone";
  }

  //literally write the html
  div.innerHTML = "<input type=\"text\" class=\"title\" placeholder=\"Title...\" onblur=\"changeItem(" + item.idCounter + ", true)\" value=\"" + item.title + "\"/>"
                + "<input type=\"text\" class=\"text\" placeholder=\"Text...\" onblur=\"changeItem(" + item.idCounter + ", true)\" value=\"" + item.text + "\"/>"
                + "<input type=\"text\" class=\"picbox\" placeholder=\"Picture URL...\" onblur=\"changeItem(" + item.idCounter + ", true)\" value=\"" + item.pic + "\"/>"
                + "<img class=\"pic\" src=\"" + item.pic + "\">"
                + "<input type=\"text\" class=\"tags\" placeholder=\"tags...\" onblur=\"changeItem(" + item.idCounter + ", true)\" value=\"" + item.tags + "\"/>"
                + "<input type=\"date\" class=\"date\" onblur=\"changeItem(" + item.idCounter + ", true)\" value=\"" + item.date + "\"/>"
                + "<input type=\"checkbox\" class=\"priority\" onclick=\"changeItem(" + item.idCounter + ", true)\"><br/>"
                + "<input type=\"checkbox\" class=\"done\" onclick=\"changeItem(" + item.idCounter + ", true)\">";
                if(item.archived){
                  div.innerHTML += "<input type=\"button\" value=\"remove from archive\" onclick=\"toggleArchive(" + item.idCounter + ")\"/>";
                } else {
                  div.innerHTML += "<input type=\"button\" value=\"archive\" onclick=\"toggleArchive(" + item.idCounter + ")\"/>";
                }

  //place on screen
  document.getElementById("content").insertBefore(div, document.getElementById("content").firstChild);
  document.getElementById(item.idCounter).getElementsByClassName("priority")[0].checked = item.priority;
  document.getElementById(item.idCounter).getElementsByClassName("done")[0].checked = item.done;
  reset();
}
