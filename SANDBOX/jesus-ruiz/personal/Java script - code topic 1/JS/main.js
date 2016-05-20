
window.onload=disable_button;

var inputs=document.getElementsByTagName("input");
var firstNameField =document.getElementById("firstName");
var lastNameField=document.getElementById("lastName");
var ageField=document.getElementById("age");
var submitButton=document.getElementById("Submit");

// Ads the event listener to call out the different functions

firstNameField.addEventListener("blur",emptyField);
lastName.addEventListener("blur",emptyField);
ageField.addEventListener("blur",emptyField);

submitButton.addEventListener("click",addRecord);


/// this function checks if all fields have been filled out

function emptyField(){

	var isEmpty=false;
	var inputCounter=0;
	var inputEmpty="";

	for (inputCounter=0;inputCounter<inputs.length;inputCounter++){
		if(inputs[inputCounter].value==""){
			isEmpty=true;
			submitButton.disabled=true;
		}
	}
	if(isEmpty==false){
		submitButton.disabled=false;
	}
}



// this function adds a record and creates the html tags dynamically

function addRecord(){
	
	var submitButton=document

	var currentName=document.getElementById("firstName").value.trim();
	var currentLastName=document.getElementById("lastName").value.trim();
	var currentAge=document.getElementById("age").value.trim();

	var divId="col-"+currentName+"-"+currentLastName+"-"+currentAge;

	var newColumn=document.createElement("div");
	var newList=document.createElement("ul");
	var newName = document.createElement("li");
	var newLastName=document.createElement("li");
	var newAageElement=document.createElement("li");
	var newDeleteButton=document.createElement("button");

	var doc=document.body;

	newColumn.id=divId;
	var exists = verifyExistance(divId);

	if (exists==true){
		return
	}

	doc.appendChild(newColumn);
	newName.appendChild(document.createTextNode(currentName));
	newLastName.appendChild(document.createTextNode(currentLastName));
	newAageElement.appendChild(document.createTextNode(currentAge));
	newDeleteButton.appendChild(document.createTextNode("Delete"));

	newColumn.appendChild(newList);
	newList.appendChild(newName);
	newList.appendChild(newLastName);
	newList.appendChild(newAageElement);
	newList.appendChild(newDeleteButton);

	newDeleteButton.addEventListener("click",deleteItem);
	createObject();
	createObject_2();
}

//disables save button

function disable_button(){
	document.getElementById("Submit").disabled=true;
}

//Validates if a record already exist based on the column id or div id

function verifyExistance(divId){
	var currentElement=document.getElementById(divId);
	var exits=false;

		if (currentElement==null){
			exits=false;
		}else{
			exits=true;
			alert("This record has already been added to the list "+ currentElement);
		}
	return exits
}

function deleteItem(){

	var ele=document.getElementById(this.parentNode.parentNode.id);
	ele.parentNode.removeChild(ele);
}

// How to create a custom object with constructor 
function createObject(){
	var person = new Object;
	person.name = document.getElementById("firstName").value;
	person.lastName = document.getElementById("lastName").value;
	person.age = document.getElementById("age").value;

	console.log("This is the object person function 1 " + person.name + " " + person.lastName + " " + person.age);
}


// another way to create a custom object
function createObject_2(){
	var name = document.getElementById("firstName").value;
	var lastName = document.getElementById("lastName").value;
	var age = document.getElementById("age").value;

	var person = {name:name, lastName:lastName,age:age};
	console.log("This is the object person function 2 " + person.name + " " + person.lastName + " " + person.age);
}

