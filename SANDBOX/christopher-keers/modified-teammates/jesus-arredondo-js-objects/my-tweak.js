// NOT FINISHED YET 95%































function addNewItem(){
	var firstName = document.getElementById('firstName').value;
	var lastName = document.getElementById('lastName').value;
	var age = document.getElementById('age').value;
	var result = list.add(firstName,lastName,age);
	if (result){
		document.getElementById('msg').innerHTML = "New entry has been added to the list";
	} else {
		document.getElementById('msg').innerHTML = "This user exists already nothing was done.";
	}
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
	var current = this.pointer;
	var id = firstName+"-"+lastName+"-"+age;
	var newEntry;
	if(this.count>0){
		while(current!=null){
			if(current.id==id){
				return false;
			}
			current = current.nextRecord;
		}
		newEntry = new entryInList(firstName,lastName,age,id);
		newEntry.nextRecord = current;
		this.pointer = newEntry;
		this.count += 1;
		updateList();
		return true;
	} else {
		this.pointer = new entryInList(firstName,lastName,age,id);
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
				this.count = 0;
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
		html += "<div class='ageName'>"+current.age+"</div>";
		html += "<div class='buttons'><input type='button' value='Delete' onclick='"+this.name+".remove("+current.id+");'></div>";
		html += "</div><br>";
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