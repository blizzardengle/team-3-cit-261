/**
 * Manage adding a new item to the list
 */
function addNewItem(){
	/**
	 * Gather data from page
	 */
	var firstName = document.getElementById('firstName').value;
	var lastName = document.getElementById('lastName').value;
	var age = document.getElementById('age').value;
	/**
	 * Attempt to add the new list item to our list object
	 */
	var result = list.add(firstName,lastName,age);
	/**
	 * If adding the item was successful clear the form and notify the user
	 */
	if (result){
		document.getElementById('msg').innerHTML = "New entry has been added to the list";
		document.getElementById('firstName').value = "";
		document.getElementById('lastName').value = "";
		document.getElementById('age').value = "";
		updateList();
	} else {
		/**
		 * If adding the item failed clear do nothing and notify the user
		 */
		document.getElementById('msg').innerHTML = "This user exists already nothing was done.";
	}
}

/**
 * These next 2 functions are only needed as a workaround to make the code much easier to understand
 * This first function is triggered by the delete HTML buttons on the page
 * The second function is called to update the list visually when all functions are done running
 */
function removeItem(id){
	return list.remove(id);
}
function updateList(){
	document.getElementById('output').innerHTML = list.print();
}

/**
 * [ A JAVASCRIPT OBJECT ]
 * This is a Javascript object. By using the keyword "this" we assign internal values to this object.
 * The "name" parameter is the name of the variable that was created to hold our list. If you look at
 * line 16 in index.html you will see I called this "list" and left out "var" making it a global variable.
 * This is not the best way to do this but it makes the rest of this code easier to understand.
 * @param {string} name the variable that was created to hold this list object
 */
function signUpList(name){
	this.name = name;
	this.pointer = null;
	this.count = 0;
}

/**
 * [ A JAVASCRIPT OBJECT PROTOTYPE ]
 * This extension to the signUpList() object handles adding a new record to the list.
 * It uses advance programming concepts: Stacks, similar to link lists.
 * @param {string} firstName first name to add for this record
 * @param {string} lastName last name name to add for this record
 * @param {number} age age to add for this record
 * @returns {Boolean} true on successful adding or false on failiure (duplicate item)
 */
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

/**
 * [ A JAVASCRIPT OBJECT PROTOTYPE ]
 * This extension to the signUpList() object handles removing a record from the list
 * It uses advance programming concepts: Stacks, similar to link lists.
 * @param {entryInList} id the entryInList object to remove from the list 
 * @returns {Boolean} true on deletion and false when not found
 */
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

/**
 * [ A JAVASCRIPT OBJECT PROTOTYPE ]
 * This extension to the signUpList() makes a giant HTML string of all the items in the list
 * @returns {String} HTML code of the items in the list
 */
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

/**
 * [ A JAVASCRIPT OBJECT ]
 * This is another Javascript object that holds a record (item) in the list.
 * nextRecord holds a pointer to "null" or another entryInList() object depending on where
 * in the list this record is
 * @param {string} firstName first name to add for this record
 * @param {string} lastName last name name to add for this record
 * @param {number} age age to add for this record
 * @param {string} id string of the previous parameters combined to make a unique id
 */
function entryInList(firstName,lastName,age,id){
	this.id = id;
	this.firstName = firstName;
	this.lastName = lastName;
	this.age = age;
	this.nextRecord = null;
}