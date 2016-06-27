/**
 * An Immediately Invoked Funtion (IFF) to wrap our core objects in.
 * This is not exactly needed but I did it anyways.
 * @param {DOM object} window the current DOM window
 */
(function(window) {
	
	/**
	 * Force us to use correct Javascript
	 */
	'use strict';
	
	/**
	 * Collection list that maps a user generated name to a local storage file
	 * this file is either another collection list or a file that contains 
	 * a flash card list.
	 * @author Christopher Keers
	 * @param {String} name user defined name to call this list
	 */
	function collection(name){
		this.name = name;
		this.head = null;
		this.tail = null;
		this.length = 0;
	}
	collection.prototype = {
		
		/**
		 * Add a record to the collection list
		 * @param {String} name user defined name to call this record in the list
		 * @returns {Boolean} true on success false when file/ record could not be created
		 */
		add: function(name){
			var newRecord = new collectionRecord(name);
			
			/**
			 * Attempt to create new local storage file with new ID
			 */
			if (storage.create(newRecord.filename,null)){ // Because we're inside this IIF we can access storage() directly
				if(this.head===null){
					this.head = newRecord;
					this.length += 1;
				} else if (this.tail===null) {
					this.head.next = newRecord;
					newRecord.previous = head;
					this.tail = newRecord;
				} else {
					tail.next = newRecord;
					newRecord.previous = this.tail;
					this.length += 1;
				}
				return true;
			} else {
				return false;
			}
		},
		
		/**
		 * Recreate a collection objects structure. Used by deserialize DO NOT ACCESS DIRECTLY
		 * @param {Object} flatObj the parsed now flat object pulled from local storage
		 */
		recreate: function(flatObj){
			var newRecord = new collectionRecord(flatObj.name);
			newRecord.filename = flatObj.filename;
			if(this.head===null){
				this.head = newRecord;
				this.length += 1;
			} else if (this.tail===null) {
				this.head.next = newRecord;
				newRecord.previous = head;
				this.tail = newRecord;
			} else {
				tail.next = newRecord;
				newRecord.previous = this.tail;
				this.length += 1;
			}
		},
		
		/**
		 * Remove a single record from the list and local storage. DO NOT USE on top level
		 * collection lists, this if for collection lists of a collection list
		 * @param {String} filename unique filename (ID) to remove
		 * @returns {Boolean} true on successful delete and false on failure
		 */
		remove: function(filename){
			var current = this.head;
			while(current!==null){
				if(current.filename===filename){
					// DELETE FILES FLASH CARDS FIRST!!!!!!!
					if(storage.remove(filename)){ // Remove from local storage first
						if(current===this.head){
							if (current.next!=null){
								this.head = current.next;
								current.next.previous = null;
								current.next = null;
							} else {
								this.head = null;
							}
						} else if (current===this.tail){
							if(current.previous===this.head){
								current.previous.next = null;
								current.previous = null;
								this.tail = null;
							} else {
								this.tail = current.previous;
								current.previous.next = null;
								current.previous = null;
							}
						} else {
							current.previous.next = current.next;
							current.next.previous = current.previous;
							current.previous = null;
							current.next = null;
						}
						this.length -= 1;
						return true;
					} else {
						return false;
					}
				}
				current = current.next;
			}
			return false;
		},
		
		/**
		 * Remove this file and any dependant files
		 * @memberOf removeChildren
		 * @param {String} filename unique filename (ID) to remove
		 * @returns {Boolean} true on success and false on any error
		 */
		removeDependants: function(filename){
			return this.removeChildren(filename);
		},
		
		/**
		 * Remove this file and any dependant files
		 * @param {String} filename unique filename (ID) to remove
		 * @returns {Boolean} true on success and false on any error
		 */
		removeChildren: function(filename){
			/**
			 * Load and deserialize the file
			 */
			var flatObj = storage.open(filename);
			if (flatObj){
				var obj = this.deserialize(flatObj);
				var current = obj.head;
				while(current!==null){
					if(!storage.remove(current.filename)){
						/**
						 * We should add a function here later that records orphaned files for deletion later
						 * At this point we have no record that the file exists but it has been left in local storage
						 */
						console.log("Data fragmentation caused. Failed to remove file from local storage: "+current.filename);
					}
					current = current.next;
				}
				storage.remove(filename);
				return true;
			} else {
				return false;
			}
		},
		
		/**
		 * Put a flat object that was serialized back together
		 * @param {Object} flatObj the parsed now flat object pulled from local storage
		 * @returns {Collection} send back the restored collection object
		 */
		deserialize: function(flatObj){
			var obj = new collection("TMP");
			var current = flatObj.head;
			while(current!==null){
				obj.recreate(current);
				current = current.next;
			}
			return obj;
		}
	};
	
	/**
	 * Collection Record object for the Collection list.
	 */
	function collectionRecord(){
		this.name = name;
		this.filename = generateId();
		this.next = null;
		this.previous = null;
	}
	
	/**
	 * Create an object to handle local storage
	 * @author Jesus Arredondo
	 */
	function storage(){}
	storage.prototype = {
		
		/**
		 * Attempt to create a local storage file
		 * @param {String} filename name of the file you will like to create (This should be autogenerated)
		 * @param {Object} obj an un-stringifed object you would like to save (Optional can be empty)
		 * @returns {Boolean} true on success and false when an error happened
		 */
		create: function(filename,obj){
			var canAdd = true;
			if(obj==null) { obj = "1"; } // If object is empty save something to avoid possible errors
			try {
				var exists = false;
				exists = existsLocalStorage(filename);
				if (exists===true){
					throw "That filename already exists";
				} else {
					localStorage.setItem(filename,JSON.stringify(obj));	
				}
			} catch(e) {
				/**
				 * Storage is full, the file name exists arealy, or the user is browsing
				 * the internet in private mode
				 */
				if(this.checkQuota(e)){
					e = "Local storage is full";
				}
				canAdd = false;
				console.log(e); // Log error to console for those that really want to know what happened
			}
			return canAdd;
		},
		
		/**
		 * Local storage file you would like to retrive
		 * @param {String} filename name (ID) of file you would like to receive
		 * @returns {Object|Boolean} flat object that was in the file on success or false on any error
		 */
		open: function(filename){
			var obj = false;
			try {
				obj = JSON.parse(localStorage.getItem(filename));
			} catch(e) {
				console.log(e); // Log error to console for those that really want to know what happened
				obj = false;
			}
			return obj;
		},
		
		/**
		 * Save an object to an already existing file
		 * @param {string} filename name of the file you will like to update
		 * @param {Object} obj an object that you want to store into this file
		 * @returns {Boolean} true on success and false on any error
		 */
		update: function(filename,obj){
			
			if(obj==null) { return false; } // Stop trying to saving a null 
			
			try {
				localStorage.setItem(filename,JSON.stringify(obj));
			} catch(e) {
				/**
				 * Storage is full or the user is browsing the internet in private mode
				 */
				if(this.checkQuota(e)){
					e = "Local storage is full";
				}
				console.log(e); // Log error to console for those that really want to know what happened
				return false;
			}
			return true;
		},
		
		/**
		 * Check if there is space to add anything to local storage. This is 
		 * not very reliable but its the best we can do with the current standards
		 * @returns {Boolean} true we can save things still false there is no more space
		 */
		checkQuota: function(e){
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
		},
		
		/**
		 * Check if filename exists in local storage
		 * @param {String} filename the filename to check on
		 * @returns {Boolean} true if the file exists and false if not
		 */
		checkFile: function(filename){
			if(localStorage.getItem(filename)!==null){
				return true;
			}
			return false;
		},
		
		/**
		 * Remove a file from local storage. This only removes one file and does
		 * not remove any other files this one may link to
		 * @param {string} filename the name of the file to delete
		 * @returns {boolean} true if it was deleted false if an error happened
		 */
		remove: function(filename){
			if (localStorage.getItem(filename)!==null){
				try {
					localStorage.removeItem(filename);
					// Double check that it was deleted
					if(this.checkFile(filename)){
						throw "The file was not deleted for some reason please try again";
					}
					// It was really deleted
					return true;
				} catch(e) {
					console.log(e); // Log error to console for those that really want to know what happened
					return false;
				}
			}
			console.log("This filename does not exists so there was nothing to delete");
			return false;
		}
	};
	
	/**
	 * Create a unique id to use for filenames
	 * @returns {String} a unique id
	 */
	function generateId(){
		return String(new Date(new Date().getTime())).replace(/[^a-zA-Z0-9]+/g,"");
	}
	
	/**
	 * Register plugins
	 */
	window.storage = storage;
	window.collection = collection;
	
}(window));