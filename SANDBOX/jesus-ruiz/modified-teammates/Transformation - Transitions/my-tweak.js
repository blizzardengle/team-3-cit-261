/**
 * 
 * I WILL ADD COMMENTS TO EXPLAIN ALL OF THIS LATER JUST WAIT
 */

window.onload=loadFromStorage;

function addNewItem(){
	var firstName = document.getElementById('firstName').value;
	var lastName = document.getElementById('lastName').value;
	var age = document.getElementById('age').value;
	var result = list.add(firstName,lastName,age);

	if (result){
		document.getElementById('msg').innerHTML = "New entry has been added to the list";
		document.getElementById('firstName').value = "";
		document.getElementById('lastName').value = "";
		document.getElementById('age').value = "";
		updateList();
		var key = firstName+"-"+lastName+"-"+age;//creates a key for localStorage
		storeInfo(firstName,lastName,age,key);//calling function to store information in local storage
	} else {
		document.getElementById('msg').innerHTML = "This user exists already nothing was done.";
	}
}

function removeItem(id){
	removeInfo(id);//this will remove the item from localStorage
	return list.remove(id);
}

function updateList(){
	document.getElementById('output').innerHTML = list.print();
}

function signUpList(name){
	this.name = name;
	this.pointer = null;
	this.count = 0;
}

signUpList.prototype.add = function(firstName,lastName,age){
	// Catch incomplete forms
	if (firstName==""||lastName==""||age==""){
		return false;
	}
	//
	var current = this.pointer;
	var id = firstName.replace(/[^0-9a-z]/gi,"")+"-"+lastName.replace(/[^0-9a-z]/gi,"")+"-"+age.replace(/[^0-9a-z]/gi,"");
	var newEntry;
	if(this.count>0){
		while(current!=null){
			if(current.id==id){
				return false;
			}
			current = current.nextRecord;
		}
		newEntry = new entryInList(firstName.replace(/[^0-9a-z\ ]/gi,""),lastName.replace(/[^0-9a-z\ ]/gi,""),age.replace(/[^0-9a-z\ ]/gi,""),id);
		newEntry.nextRecord = this.pointer;
		this.pointer = newEntry;
		this.count += 1;
		updateList();
		return true;
	} else {
		this.pointer = new entryInList(firstName.replace(/[^0-9a-z\ ]/gi,""),lastName.replace(/[^0-9a-z\ ]/gi,""),age.replace(/[^0-9a-z\ ]/gi,""),id);
		this.count += 1;
		return true;
	}
	
};

signUpList.prototype.remove = function(id){
	var current = this.pointer;
	var previous = null;
	while(current!=null){
		if(current.id==id){
			if(previous!=null){
				previous.nextRecord = current.nextRecord;
				current.nextRecord = null;
				this.count -= 1;
				updateList();
				return true;
			} else {
				this.pointer = current.nextRecord;
				current.nextRecord = null;
				this.count -= 1;
				updateList();
				return true;
			}
		}
		previous = current;
		current = current.nextRecord;
	}
	return false;
};

signUpList.prototype.print = function(){
	var html = "";
	var current = this.pointer;
	while(current!=null){
		html += "<div id='"+current.id+"' class='entryInList'>";
		html += "<div class='firstName'>"+current.firstName+"</div>";
		html += "<div class='lastName'>"+current.lastName+"</div>";
		html += "<div class='age'>"+current.age+"</div>";
		html += '<div class="buttons"><input type="button" value="Delete" onclick="removeItem(\''+current.id+'\')"></div>';
		html += "</div>";
		current = current.nextRecord;
	}
	return html;
}

function entryInList(firstName,lastName,age,id){
	this.id = id;
	this.firstName = firstName;
	this.lastName = lastName;
	this.age = age;
	this.nextRecord = null;
}

// This function is going to store all tata in local storage so next time the user opens then browser he will see all the
//information previously save 

function storeInfo(firstName,lastName,age,key){
	var person={};// creates a javascript object
	person.name=firstName;
	person.lastName=lastName;
	person.age=age;
	
	//Uses JSON.stringify method to convert object to string and saves it
	localStorage.setItem(key, JSON.stringify(person));
}

// This function is loading the information from localStorage
function loadFromStorage(){
	var person={};
	for (var i = 0; i<localStorage.length;i++){
		person=JSON.parse(localStorage.getItem(localStorage.key(i)));
		var result = list.add(person.name,person.lastName,person.age);
		updateList();
	}
}

function removeInfo(id){
	localStorage.removeItem(id);
}


// This funciton goes and checks the server for the JSON file and reteives the information from that file
function getData(){
  var url = "http://creatingux.com/byui/cit261/ajax/data.json";

  if (window.XMLHttpRequest) {
    // code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp = new XMLHttpRequest();
  } else { // code for IE6, IE5
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  
  xmlhttp.onreadystatechange=function() {
    
    if (xmlhttp.readyState===4 && xmlhttp.status===200) {
      	var data = xmlhttp.responseText;
      	getJsonData(data);// This is the action to be performed if the JSON file exists
    }
    //alert(xmlhttp.readyState+" "+xmlhttp.status);
  };
  xmlhttp.open("GET",url,true);
  xmlhttp.send();
}

// This function parses the JSON file data displays it and storages the data in local storage

function getJsonData(data){
	var person= JSON.parse(data);

	for (var i=0;i<person.people.length;i++){
		
		var name = person.people[i].firstName;
		var lastName = person.people[i].lastName;
		var age = JSON.stringify(person.people[i].age);
		var key = name+"-"+lastName+"-"+age;
	

		if(checkLocalStorage(key)==false){

			var result = list.add(name,lastName,age);
			updateList();
			storeInfo(name,lastName,age,key);
		}
	}
}

// Checks if the record already exists in local storage so there are no items duplicated
function checkLocalStorage(key){
	
	var exists=false;
	
	for (var i = 0; i<localStorage.length;i++){
		if(localStorage.key===key){
			exists=true;
			return
		}
	}

	return exists;
}


// This function calls the animation to order the list by name

function orderByName(){
	var names = document.getElementsByClassName("firstName");
	var entrysInList = document.getElementsByClassName("entryInList");
	var namesArray = [];
	var positions = [];
	var pos = 0;
	var px = 0;
	var counter = 0;
	var pxString ="";

	for (var i =0;i<names.length;i++){
		namesArray[i]=names[i].innerHTML;
	}

	namesArray.sort();
	console.log(names);

	for (var i =0; i<namesArray.length;i++){
		for (var j=0;j<names.length;j++){
			if (namesArray[i]==names[j].innerHTML){
				pos = i - j;
				positions[counter]= pos;
				counter++;
				px = pos * 40;
				pxString = px.toString();
				names[j].parentNode.style.transition = "Transform 5s";				
				names[j].parentNode.style.WebkitTransform = "translate(0, "+pxString+"px"+")";
			}
		}
	}

}