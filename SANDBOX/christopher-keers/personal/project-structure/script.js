
function collection(name){
	this.name = name;
	this.pointer = null;
	this.length = 0;
}

collection.prototype.add = function(name){
	var newRecord = new collectionRecord(name);
	var testJson = {"name":"jesus","last":"arredondo"};
	
	var canAdd = addToLocalStorage(name,testJson);
	
	/**
	 * ATTEMPT TO CREATE A LOCAL STORAGE FILE WITH THIS NEW ID 
	 */
	
	// Pass newRecord.filename as a paramter and should get TRUE or FALSE back
	// Change if statement below to account use the returned result
	
	if (canAdd===true){
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
	var result =searchLocalStorage(filename);
	
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

collectionRecord.prototype.remove = function(filename){
	/**
	 * CALL FUCTION THAT REMOVES A FILE FROM LOCAL STORAGE
	 */
	
	// Pass in the filename parameter

	removeLocalStorage(filename);
	
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



/*These are the funcitons created by Jesus Arredondo for local storage*/

/*Input: fileName and a JSON Object 
  Process: The funvtion checks if error 22 related to not having local storage space is triggered if not then it adds the record 
  and let's assign true meaning there is speace to add the record in local storage
  Output true or false if the file or record is already found on local storage
*/

 function addToLocalStorage(fileName,Obj){
	var canAdd = true;
	try {
		var exists = false;
		exists=existsLocalStorage(fileName);
		if (exists===true){
			return
		}else{
			localStorage.setItem(fileName, JSON.stringify(Obj));	
		}
	} catch(e) {
  		if (isQuotaExceeded(e)) {
    		// Storage full, maybe notify user or do some clean-up
    		canAdd=false;
  		}
	}
	return canAdd;
}

/* Input: Local Storage space exception
   Process: It checks for different error codes and names depending on the browser
   Output: True if there is no space on local storage false if there is space to save the JSON object
*/
function isQuotaExceeded(e) {
  var quotaExceeded = false;
  if (e) {
    if (e.code) {
      switch (e.code) {
        case 22:
          quotaExceeded = true;
          break;
        case 1014:
          // Firefox
          if (e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
            quotaExceeded = true;
          }
          break;
      }
    } else if (e.number === -2147024882) {
      // Internet Explorer 8
      quotaExceeded = true;
    }
  }
  return quotaExceeded;
}

/* Input fileName: Key of the record or file in local storage that needs to be seach for
   Output: True if the file or record is found and false if the record is not found on local storage
   Process: Checks if the getItem method of local storage throws something different to null
*/
function existsLocalStorage(fileName){
	var exists = false;

	
	if(localStorage.getItem(fileName)!==null){
		exists= true;
		return exists;
	}
	return exists;
}


/* Input fileName: Key of the record or file in local storage that needs to be seach for
   Output:Returns the JSON object if the file or record is found, and false if the record is not found on local storage
   Process: Checks if the getItem method of local storage throws something different to null
*/

function searchLocalStorage(fileName){
	var foundItem = "";
	var exists = false;

	if(localStorage.getItem(fileName)!==null){
		foundItem = JSON.parse(localStorage.getItem(localStorage.key(i));
		return foundItem;
	}

	return exists;
}

/*Input: file name or record key for the record to be deleted from local storage*/

function removeLocalStorage(fileName){
	if (localStorage.getItem(fileName)!==null){
		localStorage.removeItem(fileName);
	}
}