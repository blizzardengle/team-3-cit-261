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
	var person={};// creates a java object
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