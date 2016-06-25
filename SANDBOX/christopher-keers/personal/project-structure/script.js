function collection(name){
	this.name = name;
	this.pointer = null;
	this.length = 0;
}

collection.prototype.add = function(name){
	var newRecord = new collectionRecord(name);
	
	/**
	 * ATTEMPT TO CREATE A LOCAL STORAGE FILE WITH THIS NEW ID 
	 */
	
	// Pass newRecord.filename as a paramter and should get TRUE or FALSE back
	// Change if statement below to account use the returned result
	
	if (true===true){
		if(this.pointer===null){
			this.pointer = newRecord;
			this.length += 1;
		} else {
			newRecord.previous = this.pointer;
			this.pointer.next = newRecord;
			this.pointer = newRecord;
			this.length += 1;
		}
		return true;
	} else {
		return false;
	}
};

collection.prototype.remove = function(filename){
	var current = this.pointer;
	while(current!==null){
		if(current.filename===filename){
			if(current.previous===null&&current.next===null){
				// Remove it, done.
				this.pointer = null;
				current.remove();
			} else if (current.previous===null){
				// Remove and change pointer
				current.next.previous = null;
				this.pointer = current.next;
				current.remove();
			} else {
				// Update relationships
				if (current.next!==null){
					current.next.previous = current.previous;
				}
				current.previous.next = current.next;
				current.remove();
			}
			this.length -= 1;
			return false;
		}
		current = current.next;
	}
	return true;
};

collection.prototype.deserialize = function(){
	var filename = this.name;
	
	/**
	 * REQUEST FILE FROM LOCAL STORAGE JUST THE FILE DO NOT PARSE IT YET
	 */
	
	// Pass filename as a paramter and should get OBJECT STRING or FALSE back
	var result = "RETURNED OBJECT STRING HERE";
	
	if(result!==false){
		var current = JSON.parse(result).pointer;
		while(current!=null){
			this.add(current.firstName,current.lastName,current.age);
			current = current.nextRecord;
		}
		result = null;
		return true;
	} else {
		return false;
	}
};

function collectionRecord(name){
	this.name = name;
	this.filename = generateId();
	this.next = null;
	this.previous = null;
}

collectionRecord.prototype.remove = function(){
	/**
	 * CALL FUCTION THAT REMOVES A FILE FROM LOCAL STORAGE
	 */
	
	// Pass in the filename parameter
	
	/**
	 * Empty out this object (manual garbage collection)
	 */
	this.name = null;
	this.filename = null;
	this.next = null;
	this.previous = null;
};

function generateId(){
	return String(new Date(new Date().getTime())).replace(/[^a-zA-Z0-9]+/g,"");
}