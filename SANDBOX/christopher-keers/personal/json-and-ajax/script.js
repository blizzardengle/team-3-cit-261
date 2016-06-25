/**
 * Manager function that handles actually dealing with our list object
 */
function addNewItem(){
	var firstName = document.getElementById('firstName').value;
	var lastName = document.getElementById('lastName').value;
	var age = document.getElementById('age').value;
	var result = list.add(firstName,lastName,age);
	if (result){
		/**
		 * Save new list to local storage, clear form, update page with new list
		 */
		localStorage.setItem(list.key,JSON.stringify(list)); // <===== SAVING TO LOCAL STORAGE
		document.getElementById('msg').innerHTML = "<br>New entry has been added to the list";
		document.getElementById('firstName').value = "";
		document.getElementById('lastName').value = "";
		document.getElementById('age').value = "";
		updateList();
	} else {
		document.getElementById('msg').innerHTML = "<br>This user exists already nothing was done.";
	}
}

/**
 * Manager function that clears the entire list and deletes locally stored file
 */
function deleteList(){
	localStorage.removeItem(list.key); // <===== SAVING TO LOCAL STORAGE
	list = new signUpList("list","signUpList");
	updateList();
}

/**
 * Manager function that removes an item from the list and save the new list to loacl storage
 */
function removeItem(id){
	var result = list.remove(id);
	localStorage.setItem(list.key,JSON.stringify(list));
	return result;
}

/**
 * Manager function that calls the list objects print function to update the page with changes in the list
 */
function updateList(){
	document.getElementById('output').innerHTML = list.print();
}

/**
 * THE ACTUAL LIST OBJECT
 * @param {string} name the variable name you called this object, in this example it is list
 * @param {string} storageKey a unique string that we will use as the locally stored files name
 */
function signUpList(name,storageKey){
	this.name = name;
	this.key = storageKey;
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
};

/**
 * [ NEW - VERY IMPORTANT ]
 * When you use JSON.stringify to store an object in local storage you can bring its structure back with JSON.parse
 * but it will lose any methods it had. So the .add .remove .print and .deserialize fucntions of the signUpList object will
 * all be lost and unusable. This function allows us to read through the object and recreate the original object simply
 * by adding the values back into our object. For true object serialization and deserialization look up those terms
 * for JAVA. That programming language has true serialization and deserialization.
 */
signUpList.prototype.deserialize = function(obj){
	// Load in values from the sever and local storage if any exists
	if (obj==null){
		var storage =  localStorage.getItem(this.key); // <===== RETRIEVING FROM LOCAL STORAGE
	} else {
		var storage = obj; // <===== USE THE DATA RETRIEVED FROM THE SERVER BY AJAX
	}
	if (storage!=null){
		console.log(JSON.parse(storage));
		var current = JSON.parse(storage).pointer;
		while(current!=null){
			this.add(current.firstName,current.lastName,current.age);
			current = current.nextRecord;
		}
		updateList();
		localStorage.setItem(this.key,JSON.stringify(list)); // <===== SAVING TO LOCAL STORAGE
		storage = null;
	}
};

/**
 * NODE FOR THE LIST
 * @param {string} firstName
 * @param {string} lastName
 * @param {number} age
 * @param {string} id
 */
function entryInList(firstName,lastName,age,id){
	this.id = id;
	this.firstName = firstName;
	this.lastName = lastName;
	this.age = age;
	this.nextRecord = null;
}

/**
 * [ NEW - VERY IMPORTANT ]
 * When you get a JSON Object back from the server it is just like using JSON.stringify to 
 * store an object in local storage you can bring its structure back with JSON.parse but it 
 * will lose any methods it had.
 * 
 * This is a callback funtion. What you do with callback funcitons is pass them into another
 * funciton and then you can have the funciton call this one. This is very important with Ajax
 * because we never know when the response will be sent back.
 * @param {JSON Object|Null} response this is a JSON object retrived from the server or null
 */
function handleAjaxResponse(response){
	/**
	 * Call the deserialize() method and give it the  JSON object we got from the server
	 */
	list.deserialize(response);
	/**
	 * Run the normal deserialize() method which is programmed to look for a local storage file
	 */
	list.deserialize();
}

/**
 * Ajax
 * @param {string} url the url of the page we should load
 * @param {funciton} callback this is the function to call when a result is returned from the server
 */
function ajax(url,callback){
	/**
	 * Call xhr() to get the correct XMLHttpRequest for the users browsers
	 * have the function ajaxRequest handle communication once a request is called
	 * and return false now if no connection could be made
	 */
	var ajaxCon = xhr();
	ajaxCon.onreadystatechange = ajaxRequest;
	if(ajaxCon==false){ return false; }
	
	/**
	 * Handle the actual communications return or display back to the user based on the HTTP status code
	 */
	function ajaxRequest(){
		
		/**
		 * Once the connections transaction is complete
		 */
		if(ajaxCon.readyState==XMLHttpRequest.DONE){
			/**
			 * Send the correct result based on the responses status
			 */
			if (ajaxCon.status=="OK"||ajaxCon.status==200){
				callback(ajaxCon.responseText); // <=== Send back the JSON Object
			} else {
				callback(null); // <=== Send back null so nothing gets broken
			}
		}
	}
	
	/**
	 * Initiate an ajax connection
	 */
	ajaxCon.open("GET",url);
	ajaxCon.send();
}

/**
 * Get correct XMLHttpRequest for the users browser
 * COPIED FROM: http://stackoverflow.com/a/15339941/3193156
 * @returns {XMLHttpRequest|ActiveXObject|Boolean} correct XMLHttpRequest or false is none was found
 */
function xhr(){
    try {
        return new XMLHttpRequest();
    }catch(e){}
    try {
        return new ActiveXObject("Msxml3.XMLHTTP");
    }catch(e){}
    try {
        return new ActiveXObject("Msxml2.XMLHTTP.6.0");
    }catch(e){}
    try {
        return new ActiveXObject("Msxml2.XMLHTTP.3.0");
    }catch(e){}
    try {
        return new ActiveXObject("Msxml2.XMLHTTP");
    }catch(e){}
    try {
        return new ActiveXObject("Microsoft.XMLHTTP");
    }catch(e){}
    return false;
}