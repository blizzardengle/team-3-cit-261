/**
 * Print out the human readable string of the select option they choose
 * @author Christopher Keers
 * @param {Number} num which select option the user picked
 * @returns {String} selected type value as a string
 */
function printType(num){
	switch(num){
		case 0:
			return "<i>No type choosen.</i>";
		case 1:
			return "True or False";
		case 2:
			return "Multiple Choice";
		case 3:
			return "Fill in the Blank";
		case 4:
			return "Mathmatic";
		case 5:
			return "Scientific";
		case 6:
			return "Vocabulary";
		case 7:
			return "Group 1";
		case 8:
			return "Group 2";
		case 9:
			return "Group 3";
		default:
			return "<i>No type choosen.</i>";
	}
}


 function showHint(str)
   {
    if (str.length===0)
     { 
      document.getElementById("txtHint").innerHTML="";
      return;
     }
   if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp=new XMLHttpRequest();
   }
   else
   {// code for IE6, IE5
    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
   }
   xmlhttp.onreadystatechange=function()
   {
    if (xmlhttp.readyState===4 && xmlhttp.status===200)
    {
     document.getElementById("txtHint").innerHTML=xmlhttp.responseText;
    }
   };
   xmlhttp.open("GET","gethint.php?q="+str,true);
   xmlhttp.send();
  }
  

/**
 * Print out the HTML select list for the flash card types
 * @author Christopher Keers
 * @param {type} id unique id of object this list belongs to
 * @returns {String} HTML select list of type options
 */
function printTypeSelect(id){
	return '<select name="card-type" data-card-type="'+id+'"><option value="0"></option><option value="1">True or False</option><option value="2">Multiple Choice</option><option value="3">Fill in the Blank</option><option value="4">Mathematic</option><option value="5">Scientific</option><option value="6">Vocabulary</option><option value="7">Group 1</option><option value="8">Group 2</option><option value="9">Group 3</option></select>';
}

/**
 * Creat the buttons that will launch our games
 * @author Christopher Keers
 */
function genGameLinks(){
	var games = {
		"Memory Match":"loadMemoryGame",  // <=== Notice the , after each line
		"Flash Cards":"createFlashCards"
	};
	
	var html = "";
	
	for (var key in games) {
		html += '<li onclick="'+games[key]+'();">'+key+'</li>';
	}
	
	document.getElementById("game-menu").innerHTML = html;
}

/**
 * Load main page. If no subjects exist then the object is created and stored
 * empty until the user adds subjects (collectionRecords)
 * @author Christopher Keers
 */
function loadSubjects(){
	var errorFlag = false;
	
	/**
	 * Load subjects and save as a global variable
	 * create the file if its missing
	 */
	if(storage.checkFile("SUBJECTS")){
		var flatObj = storage.open("SUBJECTS");
		if(flatObj!==false){
			subjects = new collection("TMP");
			subjects.deserialize(flatObj);
		} else {
			errorFlag = true;
			console.log("We could not open a required file from local storage please re-load the page and try again.");
		}
	} else {
		if(storage.create("SUBJECTS",null)){
			subjects = new collection("SUBJECTS");
			storage.save("SUBJECTS",subjects);
		} else {
			errorFlag = true;
			console.log("We were unable to create a required file please re-load the page and try again.");
		}
	}
	
	/**
	 * Create subject tiles if there were no errors earlier
	 */
	if(!errorFlag){
		genSubjectTiles();
	}
}

/**
 * Loop through the subjects object (Collection) and display its
 * records on the page. These are clickable and allow loading the
 * subject or deleting it from the list.
 * @author Christopher Keers
 */
function genSubjectTiles(){
	var html = "";
	var current = subjects.head;
	while (current!==null){
		html += '<div class="tile" id="'+current.filename+'"><div class="name" onclick="loadChoosenSubject(\''+current.filename+'\')">'+current.name+'</div><div class="controls"><div class="edit" title="Edit" onclick="editSubjectTile(\''+current.filename+'\');"><i class="fa fa-pencil"></i></div><div class="remove" title="Remove" onclick="removeSubjectTile(\''+current.filename+'\')"><i class="fa fa-trash-o"></i></div></div></div>';
		current = current.next;
	}
	document.getElementById("content").innerHTML = html;
	
	/**
	 * Update add button and turn on input
	 */
	var btn = find(".btn-wrapper",document.getElementById("controls"));
	btn = btn[0];
	btn.onclick = addSubject;
	document.getElementById("form-subject").placeholder = "Add Class / Subject";
	document.getElementById("form-subject").style.display = "inline-block";
	document.getElementById("save-btn-wrapper").style.display = "none";
}

/**
 * Turns a choosen subject tile into editable mode
 * @author Christopher Keers
 * @param {String} id unique id used as the local storage file for this collection
 */
function editSubjectTile(id){
	var startingPoint = document.getElementById(id);
	var topicHtml = find(".name",startingPoint);
	topicHtml = topicHtml[0];
	var topic = topicHtml.innerHTML;
	var controls = find(".controls",startingPoint);
	controls = controls[0];
	
	topicHtml.innerHTML = '<textarea name="topic-card" data-topic-name="">'+topic+'</textarea>';
	topicHtml.onclick = null;
	controls.innerHTML = '<div class="edit" title="Save" onclick="saveSubjectTile(\''+id+'\');"><i class="fa fa-floppy-o"></i></div><div class="remove" title="Remove" onclick="removeTopicTile(\''+id+'\')"><i class="fa fa-trash-o"></i></div></div>';
}

/**
 * Save changes made to a tile and remove editable mode
 * @author Christopher Keers
 * @param {String} id unique id used as the local storage file for this collection
 */
function saveSubjectTile(id){
	var startingPoint = document.getElementById(id);
	var topicHtml = find(".name",startingPoint);
	topicHtml = topicHtml[0];
	var topic = find("[data-topic-name]",startingPoint);
	topic = topic[0].value;
	var controls = find(".controls",startingPoint);
	controls = controls[0];
	
	controls.innerHTML = '<div class="name" onclick="loadChoosenSubject(\''+id+'\')">'+id+'</div><div class="controls"><div class="edit" title="Edit" onclick="editSubjectTile(\''+id+'\');"><i class="fa fa-pencil"></i></div><div class="remove" title="Remove" onclick="removeSubjectTile(\''+id+'\')"><i class="fa fa-trash-o"></i></div></div>';
	
	if(topic.length>0){
		topicHtml.innerHTML = topic;
		topicHtml.onclick = loadChoosenSubject.bind(null,id);
		
		var current = subjects.head;
		while(current!==null){
			if(current.filename===id){
				current.name = topic;
				break;
			}
			current = current.next;
		}
		
		if(!storage.update(subjects.name,subjects.serialize())){
			// Error out
			console.log("We were unable to update a required file please re-load the page and try again.");
		}
	} else {
		// Error
	}
}

/**
 * Remove subject tile from list of subjects (Collection)
 * @author Christopher Keers
 * @param {String} id unique id used as the local storage file for this collection
 */
function removeSubjectTile(id){
	// Remove from subject list
	subjects.removeDependants(id);
	subjects.remove(id);
	if(storage.update("SUBJECTS",subjects.serialize())){
		genSubjectTiles();
	} else {
		// Error out
		console.log("We were unable to update a required file please re-load the page and try again.");
	}
}

/**
 * Add a subject to the users collection
 * @author Christopher Keers
 */
function addSubject(){
	var name = document.getElementById("form-subject").value;
	document.getElementById("form-subject").value = "";
	if(name.length>1){
		var newFile = subjects.add(name);
		if(newFile!==false){
			// Save an empty collection object into this new subject
			if(storage.update(newFile,new collection(name).serialize())){
				// Save new subjects structure
				if(storage.update("SUBJECTS",subjects.serialize())){
					genSubjectTiles();
				} else {
					// Error out
					console.log("We were unable to update a required file please re-load the page and try again.");
				}
			} else {
				// Error out
				console.log("We were unable to update a required file please re-load the page and try again.");
			}
		} else {
			// Error out
			console.log("We were unable to create a required file please re-load the page and try again.");
		}
	}
}

/**
 * Load the selected subject and change controls to the controls for topics
 * @author Christopher Keers
 * @param {String} id unique id that is used to pull the object from local storage
 */
function loadChoosenSubject(id){
	var flatObj = storage.open(id);
	
	/**
	 * If the file loaded deserialize the object, show any records to the
	 * user and wait for the user to add, remove, or select a record
	 */
	if(flatObj!==false){
		choosenSubject = new collection(flatObj.name);
		choosenSubject.deserialize(flatObj);
		choosenSubject.id = id; // THIS IS NEW. We tack on an ID value here because we need it 2nd level and lower
		genTopicTiles();
	} else {
		// Error 
		console.log("We were unable to load a required file please re-load the page and try again.");
	}
}

/**
 * Loop through the topic object (Collection) and display its
 * records on the page. These are clickable and allow loading the
 * topic or deleting it from the list.
 * @author Christopher Keers
 */
function genTopicTiles(){
	var html = "";
	var current = choosenSubject.head;
	while (current!==null){
		html += '<div class="tile" id="'+current.filename+'"><div class="name" onclick="loadFlashCards(\''+current.filename+'\')">'+current.name+'</div><div class="controls"><div class="edit" title="Edit" onclick="editTopicTile(\''+current.filename+'\');"><i class="fa fa-pencil"></i></div><div class="remove" title="Remove" onclick="removeTopicTile(\''+current.filename+'\')"><i class="fa fa-trash-o"></i></div></div></div>';
		current = current.next;
	}
	document.getElementById("content").innerHTML = html;
	
	/**
	 * Update add button and turn on input
	 */
	var btn = find(".btn-wrapper",document.getElementById("controls"));
	btn = btn[0];
	btn.onclick = addTopic;
	document.getElementById("form-subject").placeholder = "Add Topic / Study Set";
	document.getElementById("form-subject").style.display = "inline-block";
	document.getElementById("save-btn-wrapper").style.display = "none";
}

/**
 * Turns a choosen topic tile into editable mode
 * @author Christopher Keers
 * @param {String} id unique id used as the local storage file for this collection
 */
function editTopicTile(id){
	var startingPoint = document.getElementById(id);
	var topicHtml = find(".name",startingPoint);
	topicHtml = topicHtml[0];
	var topic = topicHtml.innerHTML;
	var controls = find(".controls",startingPoint);
	controls = controls[0];
	
	topicHtml.innerHTML = '<textarea name="topic-card" data-topic-name="">'+topic+'</textarea>';
	topicHtml.onclick = null;
	controls.innerHTML = '<div class="edit" title="Save" onclick="saveTopicTile(\''+id+'\');"><i class="fa fa-floppy-o"></i></div><div class="remove" title="Remove" onclick="removeTopicTile(\''+id+'\')"><i class="fa fa-trash-o"></i></div></div>';
}

/**
 * Save changes made to a tile and remove editable mode
 * @author Christopher Keers
 * @param {String} id unique id used as the local storage file for this collection
 */
function saveTopicTile(id){
	var startingPoint = document.getElementById(id);
	var topicHtml = find(".name",startingPoint);
	topicHtml = topicHtml[0];
	var topic = find("[data-topic-name]",startingPoint);
	topic = topic[0].value;
	var controls = find(".controls",startingPoint);
	controls = controls[0];
	
	controls.innerHTML = '<div class="name" onclick="loadFlashCards(\''+id+'\')">'+id+'</div><div class="controls"><div class="edit" title="Edit" onclick="editTopicTile(\''+id+'\');"><i class="fa fa-pencil"></i></div><div class="remove" title="Remove" onclick="removeTopicTile(\''+id+'\')"><i class="fa fa-trash-o"></i></div></div>';
	
	if(topic.length>0){
		topicHtml.innerHTML = topic;
		topicHtml.onclick = loadFlashCards.bind(null,id);
		
		var current = choosenSubject.head;
		while(current!==null){
			if(current.filename===id){
				current.name = topic;
				break;
			}
			current = current.next;
		}
		
		if(!storage.update(choosenSubject.id,choosenSubject.serialize())){
			// Error out
			console.log("We were unable to update a required file please re-load the page and try again.");
		}
	} else {
		// Error
	}
}

/**
 * Remove topic tile from list of topics (Collection)
 * @author Christopher Keers
 * @param {String} id unique id used as the local storage file for this collection
 */
function removeTopicTile(id){
	/**
	 * Remove the topic form this collection and local storage
	 */
	choosenSubject.remove(id);
	
	// THIS IS DANGEROUS if it errors out here the local storage file is toast aleready!!!
	if(storage.update(choosenSubject.id,choosenSubject.serialize())){
		genTopicTiles();
	} else {
		// Error out
		console.log("We were unable to update a required file please re-load the page and try again.");
	}
}

/**
 * Add a topic (study list) to the users currently selected subject (class)
 * @author Christopher Keers
 */
function addTopic(){
	var name = document.getElementById("form-subject").value;
	document.getElementById("form-subject").value = "";
	if(name.length>1){
		var newFile = choosenSubject.add(name);
		if(newFile!==false){
			// Save an empty flashcard set object into this new topic
			if(storage.update(newFile,new flashCardSet(name,newFile))){
				// Save new subjects structure
				if(storage.update(choosenSubject.id,choosenSubject.serialize())){
					genTopicTiles();
				} else {
					// Error out
					console.log("We were unable to update a required file please re-load the page and try again.");
				}
			} else {
				// Error out
				console.log("We were unable to update a required file please re-load the page and try again.");
			}
		} else {
			// Error out
			console.log("We were unable to create a required file please re-load the page and try again.");
		}
	}
}

/**
 * Load the selected topic's flash cards
 * @author Christopher Keers
 * @param {String} id the unique ID used as the local storage file name
 */
function loadFlashCards(id){
	var flatObj = storage.open(id);
	
	/**
	 * If the file loaded deserialize the object, show any records to the
	 * user and wait for the user to add, remove, or select a record
	 */
	if(flatObj!==false){
		choosenTopic = new flashCardSet(flatObj.name,id);
		choosenTopic.deserialize(flatObj);
		genFlashCards();
	} else {
		// Error out
		console.log("We were unable to load a required file please re-load the page and try again.");
	}
}

/**
 * Loop through the choosen flash card list and display them on
 * on the page. These are clickable and allow editing or deleting
 * @author Christopher Keers
 */
function genFlashCards(){
	var html = '<div class="flashcard-set title-row"><div class="term">Term</div><div class="definition">Definition</div><div class="type">Type</div><div class="controls" style="border-left: 0 transparent;padding-top: 10px;">Controls</div></div>';
	var current = choosenTopic.head;
	while (current!==null){
		html += '<div class="flashcard-set" id="'+current.id+'""><div class="term">'+current.term+'</div><div class="definition">'+current.definition+'</div><div class="type">'+printType(current.type)+'</div><div class="controls"><div class="edit" title="Edit" onclick="editCard(\''+current.id+'\');"><i class="fa fa-pencil"></i></div><div class="remove" title="Remove" onclick="removeCard(\''+current.id+'\')"><i class="fa fa-trash-o"></i></div></div></div>';
		current = current.next;
	}
	document.getElementById("content").innerHTML = html;
	
	/**
	 * Update add button
	 */
	var btn = find(".btn-wrapper",document.getElementById("controls"));
	btn = btn[0];
	btn.onclick = addCard;
	document.getElementById("form-subject").style.display = "none";
	document.getElementById("save-btn-wrapper").style.display = "inline-block";
	
	/**
	 * Turn on the back button and play button
	 */
	var btn = find(".back-btn",document.getElementById("controls"));
	btn = btn[0];
	btn.style.display = "inline-block";
	btn = find(".game-btn",document.getElementById("controls"));
	btn = btn[0];
	btn.style.display = "inline-block";
}

/**
 * Save new flash cards to the currently active flash card set saved in global variable: choosenTopic
 * @author Christopher Keers
 */
function saveCards(){
	/**
	 * Find all the new cards
	 */
	var startingPoint = document.getElementById("content");
	var terms = find("[data-card-term]",startingPoint);
	var definitions = find("[data-card-definition]",startingPoint);
	var types = find("[data-card-type]",startingPoint);
	
	/**
	 * Match all the cards together dropping any that are 
	 * missing values and add to the flash card set
	 */
	var len = terms.length, tmpTerm = null, tmpDefinition = null;
	for(var x=0;x<len;x++){
		tmpTerm = terms[x].value;
		tmpDefinition = definitions[x].value;
		if (tmpTerm.length>0&&tmpDefinition.length>0){
			choosenTopic.add(tmpTerm,tmpDefinition,types[x].value);
		}
	}
	
	if(storage.update(choosenTopic.filename,choosenTopic.serialize())){
		genFlashCards();
	} else {
		// Error out
	}
	
}

/**
 * Add a new ediatble flashcard to the page for the user
 * @author Christopher Keers
 */
function addCard(){
	var id = storage.id();
	var newNode = document.createElement('div');
	newNode.className = "flashcard-set";
	newNode.id = id;
	newNode.innerHTML = '<div class="term"><textarea name="card-term" data-card-term="'+id+'" placeholder="Term"></textarea></div><div class="definition"><textarea name="card-definition" data-card-definition="'+id+'" placeholder="Definition"></textarea></div><div class="type">'+printTypeSelect(id)+'</div><div class="controls"><div class="edit" title="Edit" style="visibility: hidden;"><i class="fa fa-pencil"></i></div><div class="remove" title="Remove" onclick="removeNewCard(\''+id+'\')"><i class="fa fa-trash-o"></i></div></div>';
	document.getElementById("content").appendChild(newNode);
}

/**
 * The user no longer wants this new flash card just remove its HTML and it wont be saved
 * @author Christopher Keers
 * @param {String} id unique id of this HTML element to remove from the DOM
 */
function removeNewCard(id){
	document.getElementById(id).outerHTML = "";
}

/**
 * Trun choosen flash card into editable mode inline
 * @author Christopher Keers
 * @param {String} id unique id of this HTML element
 */
function editCard(id){
	/**
	 * Get current cards data
	 */		
	var current = choosenTopic.head;
	var term = null, definition = null, type = null;
	while(current!==null){
		if(current.id===id){
			term = current.term;
			definition = current.definition;
			type = current.type;
			break;
		}
		current = current.next;
	}
	
	/**
	 * Edit inline card to be editable now
	 */
	var startingPoint = document.getElementById(id);
	var termHtml = find(".term",startingPoint);
	termHtml = termHtml[0];
	var definitionHtml = find(".definition",startingPoint);
	definitionHtml = definitionHtml[0];
	var typeHtml = find(".type",startingPoint);
	typeHtml = typeHtml[0];
	var controls = find(".controls",startingPoint);
	controls = controls[0];
	termHtml.innerHTML = '<textarea name="card-term" data-card-term="" placeholder="Term">'+term+'</textarea>';
	definitionHtml.innerHTML = '<textarea name="card-definition" data-card-definition="" placeholder="Definition">'+definition+'</textarea>';
	typeHtml.innerHTML = printTypeSelect(id);
	controls.innerHTML = '<div class="edit" title="Save" onclick="saveCardEdit(\''+id+'\');"><i class="fa fa-floppy-o"></i></div><div class="remove" title="Remove" onclick="removeCard(\''+id+'\')"><i class="fa fa-trash-o"></i></div>';
	
	/**
	 * Set correct selected type
	 */
	var selectElem = find("[data-card-type]",startingPoint);
	setSelectedValue(selectElem[0],type);
	
	function setSelectedValue(elem,value){
		for(var i=0; i < elem.options.length; i++){
			if(elem.options[i].value == value) { // Can't be === because we never know when its being treated as an number or string
				elem.selectedIndex = i;
				break;
			}
		}
	}
}

/**
 * Save the users changes to this flash card and turn off editable mode
 * @author Christopher Keers
 * @param {String} id unique id of this HTML element to remove from the DOM
 */
function saveCardEdit(id){
	
	var startingPoint = document.getElementById(id);
	var term = find("[data-card-term]",startingPoint);
	term = term[0].value;
	var definition = find("[data-card-definition]",startingPoint);
	definition = definition[0].value;
	var type = find("[data-card-type]",startingPoint);
	type = parseInt(type[0].value);
	
	var current = choosenTopic.head;
	while(current!==null){
		if(current.id===id){
			current.term = term;
			current.definition = definition;
			current.type = type;
			break;
		}
		current = current.next;
	}
	
	var termHtml = find(".term",startingPoint);
	termHtml = termHtml[0];
	var definitionHtml = find(".definition",startingPoint);
	definitionHtml = definitionHtml[0];
	var typeHtml = find(".type",startingPoint);
	typeHtml = typeHtml[0];
	var controls = find(".controls",startingPoint);
	controls = controls[0];
	
	if(storage.update(choosenTopic.filename,choosenTopic.serialize())){
		termHtml.innerHTML = term;
		definitionHtml.innerHTML = definition;
		typeHtml.innerHTML = printType(type);
		controls.innerHTML = '<div class="edit" title="Edit" onclick="editCard(\''+current.id+'\');"><i class="fa fa-pencil"></i></div><div class="remove" title="Remove" onclick="removeCard(\''+current.id+'\')"><i class="fa fa-trash-o"></i></div></div>';
	} else {
		// Error out
	}
}

/**
 * Remove choosen card from the flash card set and update local storage
 * @author Christopher Keers
 * @param {String} id unique id of this object in local storage
 */
function removeCard(id){
	/**
	 * Remove card
	 */
	choosenTopic.remove(id);
	
	/**
	 * Update local storage
	 */
	if(storage.update(choosenTopic.filename,choosenTopic.serialize())){
		genFlashCards();
	} else {
		// Error out
		console.log("We were unable to update a required file please re-load the page and try again.");
	}
}

/**
 * Load main list of subjects and close any open topic list (choosenSubject) or topic (choosenTopic)
 * @author Christopher Keers
 */
function chooseSubject(){
	choosenSubject = null;
	choosenTopic = null; // This allows us to jump from a flash card set back to the main menu
	
	/**
	 * Hide the back button and the play button
	 */
	var btn = find(".back-btn",document.getElementById("controls"));
	btn = btn[0];
	btn.style.display = "none";
	btn = find(".game-btn",document.getElementById("controls"));
	btn = btn[0];
	btn.style.display = "none";
	
	genSubjectTiles();
}

/**
 * Load currently active topic list (choosenSubject) and remove currently selected topic (choosenTopic)
 * @author Christopher Keers
 */
function chooseTopic(){
	choosenTopic = null;
	
	/**
	 * Hide the back button and play button
	 */
	var btn = find(".back-btn",document.getElementById("controls"));
	btn = btn[0];
	btn.style.display = "none";
	btn = find(".game-btn",document.getElementById("controls"));
	btn = btn[0];
	btn.style.display = "none";
	
	genTopicTiles();
} 

/**
 * An Immediately Invoked Funtion (IFFE) to wrap our core objects in.
 * This is not exactly needed but I did it anyways.
 * @link http://benalman.com/news/2010/11/immediately-invoked-function-expression/
 * @param {DOM object} window the current DOM window
 */
(function(window) {
	
	/**
	 * Force us to use correct (strict) Javascript inside this IFFE
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
		 * @returns {Boolean} new unique ID on success false when file/ record could not be created
		 */
		add: function(name){
			var newRecord = new collectionRecord(name);
			
			/**
			 * Attempt to create new local storage file with new ID
			 */
			if (internalStorage.create(newRecord.filename,null)){
				if(this.head===null){
					this.head = newRecord;
				} else if (this.tail===null) {
					newRecord.previous = this.head;
					this.tail = newRecord;
					this.head.next = this.tail;
				} else {
					newRecord.previous = this.tail;
					newRecord.previous.next = newRecord;
					this.tail = newRecord;
				}
				this.length += 1;
				return newRecord.filename;
			} else {
				return false;
			}
		},
		
		/**
		 * Recreate a collection objects structure. Used by deserialize DO NOT ACCESS DIRECTLY.
		 * This is a special add method becuase our normal add method above creates a new
		 * local storage file when you add a record and we don't want to do that when rebuilding
		 * this object or well destroy local storage with fragmentation
		 * @param {Object} flatObj the parsed now flat object pulled from local storage
		 */
		recreate: function(flatObj){
			var newRecord = new collectionRecord(flatObj.name);
			newRecord.filename = flatObj.filename;
			if(this.head===null){
				this.head = newRecord;
			} else if (this.tail===null) {
				newRecord.previous = this.head;
				this.tail = newRecord;
				this.head.next = this.tail;
			} else {
				newRecord.previous = this.tail;
				newRecord.previous.next = newRecord;
				this.tail = newRecord;
			}
			this.length += 1;
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
					// Remove file from storage if it exists
					if(!internalStorage.remove(filename)){ 
						// Log error but keep going
						console.log("ERROR");
					}
					if(current===this.head){
						if (current.next!==null){
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
				}
				current = current.next;
			}
			return false;
		},
		
		/**
		 * Method to get the human readable name from a files unique ID
		 * @param {String} filename the filename (ID) to get the human readable name from
		 * @returns {String|Boolean} string of the human readable name on success or false on error
		 */
		getName: function(filename){
			var current = this.head;
			while(current!==null){
				if(current.filename===filename){
					return current.name;
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
			var flatObj = internalStorage.open(filename);
			if (flatObj){
				var obj = new collection(flatObj.name);
				obj.deserialize(flatObj);
				var current = obj.head;
				while(current!==null){
					if(!internalStorage.remove(current.filename)){
						/**
						 * We should add a function here later that records orphaned files for deletion later
						 * At this point we have no record that the file exists but it has been left in local storage
						 */
						console.log("Data fragmentation caused. Failed to remove file from local storage: "+current.filename);
					}
					current = current.next;
				}
				internalStorage.remove(filename);
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
			this.name = flatObj.name;
			var current = flatObj.head;
			while(current!==null){
				this.recreate(current);
				current = current.next;
			}
		},
		
		/**
		 * Javascript can not handle circular refrences. Basicly by having a head pointer
		 * and a tail pointer if there is only 2 things in the collection the collection
		 * does infinite pointing back and forth between the records and breaks JSON.
		 * @returns {Collection object} a copy of the collection object with all previous pointers removed
		 */
		serialize: function(){
			var copyCollection = clone(this);
			var current = copyCollection.head;
			while(current!==null){
				current.previous = null;
				current = current.next;
			}
			copyCollection.tail = null;
			return copyCollection;
			
			/**
			 * Private internal function that clones our collection object
			 * @param {Colleciton object} obj the current collection object
			 * @returns {Collection object} a cloned and trimed collection object
			 */
			function clone(obj){
				var clone = new collection(obj.name);
				var current = obj.head;
				while(current!==null){
					clone.recreate(current);
					current = current.next;
				}
				return clone;
			}
		}
	};
	
	/**
	 * Collection Record object for the Collection list.
	 * @author Christopher Keers
	 * @param {String} name what the user called this subject
	 */
	function collectionRecord(name){
		this.name = name;
		this.filename = generateId();
		this.next = null;
		this.previous = null;
	}
	
	/**
	 * Flash card set object that contains a whole study set of flash cards
	 * @author Christopher Keers
	 * @param {String} name user defined name of this flash card set
	 * @param {String} filename unique ID used as this flash card sets local storage filename
	 */
	function flashCardSet(name,filename){
		this.name = name;
		this.filename = filename;
		this.head = null;
		this.tail = null;
		this.length = 0;
	}
	flashCardSet.prototype = {
		
		/**
		 * Add a flash card to this flash card set
		 * @param {String} term user defined term (question)
		 * @param {String} definition user defined definition (answer)
		 * @param {Number} type user defined type; number that represents what group this question belongs with
		 */
		add: function(term,definition,type){
			if(type!==null){ type = parseInt(type); } else {  type = 0; } // Prep type by making sure its a number
			var newCard = new flashCards(term,definition,type);
			
			if(this.head===null){
				this.head = newCard;
			} else if (this.tail===null) {
				this.head.next = newCard;
				newCard.previous = this.head;
				this.tail = newCard;
			} else {
				newCard.previous = this.tail;
				this.tail.next = newCard;
				this.tail = newCard;
			}
			this.length += 1;
		},
		
		remove: function(id){
			var current = this.head;
			while(current!==null){
				if(current.id===id){
					if(current===this.head){
						if (current.next!==null){
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
				}
				current = current.next;
			}
			return false;
		},
		
		/**
		 * Put a flat object that was serialized back together
		 * @param {Object} flatObj the parsed now flat object pulled from local storage
		 * @returns {Flash Card Set object} send back the restored flash card set object
		 */
		deserialize: function(flatObj){
			this.name = flatObj.name;
			this.filename = flatObj.filename;
			var current = flatObj.head;
			while(current!==null){
				this.add(current.term,current.definition,current.type);
				current = current.next;
			}
		},
		
		/**
		 * Javascript can not handle circular refrences. Basicly by having a head pointer
		 * and a tail pointer if there is only 2 things in the collection the collection
		 * does infinite pointing back and forth between the records and breaks JSON.
		 * @returns {Flash Card object} a copy of the flash card set object with all previous pointers removed
		 */
		serialize: function(){
			var copyCollection = clone(this);
			var current = copyCollection.head;
			while(current!==null){
				current.previous = null;
				current = current.next;
			}
			copyCollection.tail = null;
			return copyCollection;
			
			/**
			 * Private internal function that clones our flash card object
			 * @param {Flash Card object} obj the current flash card object
			 * @returns {Flash Card object} a cloned and trimed flash card object
			 */
			function clone(obj){
				var clone = new flashCardSet(obj.name,obj.filename);
				var current = obj.head;
				while(current!==null){
					clone.add(current.term,current.definition,current.type,current.id);
					current = current.next;
				}
				return clone;
			}
		}
	};
	
	/**
	 * Flash Card objects for a Flash Card Set object
	 * @param {String} term the term (question) for this flash card
	 * @param {String} definition the definition (answer) for this flash card
	 * @param {Number} type a number used to determine what type of question this so we create test properly
	 * @param {String} id unique ID for this card. This is only used by an interal method DO NOT USE
	 */
	function flashCards(term,definition,type,id){
		this.term = term;
		this.definition = definition;
		this.id = id || generateId(); // We need this so we know which card to delete
		this.type = type || 0;
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
			if(obj===null) { obj = "1"; } // If object is empty save something to avoid possible errors
			try {
				var exists = false;
				exists = this.checkFile(filename);
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
		 * @memberOf update
		 * @param {string} filename name of the file you will like to update
		 * @param {Object} obj an object that you want to store into this file
		 * @returns {Boolean} true on success and false on any error
		 */
		save: function(filename,obj){
			return this.update(filename,obj);
		},
		
		/**
		 * Save an object to an already existing file
		 * @param {string} filename name of the file you will like to update
		 * @param {Object} obj an object that you want to store into this file
		 * @returns {Boolean} true on success and false on any error
		 */
		update: function(filename,obj){
			
			if(obj===null) { return false; } // Stop trying to saving a null 
			
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
		 * @param {String} e error that was thrown
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
         * Retreive all flash cards from a topic folder
         * @param {string} item folder name containing flashcards
         * @returns {array of objects} returns an array containing all the flash card object
         * for a choosen topic
         */
        getFlashCards: function (item) {
            var cards = [];

            for (var i = 0; i < localStorage.length; i++) {

                var current = item.head;
                var next = current.next;
                cards.push(current);

                while (next !== null) {
                    current = next;
                    next = current.next;
                    cards.push(current);
                }
                return cards;
            }
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
		},
		
		/**
		 * Not really needed used for debuging mainly. You can use this
		 * to get a unique ID to use elsewhere in the APP. Just call
		 * storage.id() and you'll get an ID to use
		 * @returns {String} unique ID
		 */
		id: function(){
			return generateId();
		}
	};
	
	/**
	 * Create a unique id to use for filenames or other general things that need to be unique
	 * @returns {String} a unique id
	 */
	function generateId(){
		var ranNum = Math.floor((Math.random() * 1000) + 1) + "-" + Math.floor((Math.random() * 1000) + 1);
		return MD5.hash(String(new Date(new Date().getTime())) + "-" + ranNum);
	}
	
	/**
	 * Register plugins
	 */
	window.storage = storage;
	window.collection = collection;
	window.flashCardSet = flashCardSet;
	
	/**
	 * Create an internal storage object that the IIFE functions can use
	 */
	var internalStorage = new storage();
	
}(window));

/**
 * Search down the DOM tree for all matches of a provided selector. Unless an optional
 * starting parameter is given the function will default to the document body.
 * @author Christopher Keers
 * @param {string} selector What to search for: ID, class, tag, or data attribute
 * @param {node} elem An optional element for this function to start the search at
 * @returns {Array|Boolean} Array of matched DOM elements or false if nothing was found
 */
function find(){
	
	/**
	 * Save the selector we're looking for or return false
	 */
	var selector = arguments[0];
	if (selector==null||selector.length<1){
		return false;
	}
	
	/**
	 * Check if we're supposed to start our search at the document body or elsewhere
	 */
	var elem = arguments[1];
	if (elem==null||elem.length<1){
		elem = document.body;
	}
	
	/**
	 * If selector is a data attribute attempt to split the attribute from the value; there may not be a value
	 */
	var firstChar = selector.charAt(0), attribute, value = false, supports = 'classList' in document.documentElement;
	if (firstChar==="[") {
		selector = selector.substr( 0, selector.length - 1 );
		attribute = selector.split( '=' );
		if ( attribute.length > 1 ) {
			value = true;
			attribute[1] = attribute[1].replace( /"/g, '' ).replace( /'/g, '' );
		}
		attribute[0] = attribute[0].substr( 1,attribute[0].length );
	}
	
	/**
	 * Create a link list to store results and start searching
	 */
	var results = new list();
	
	/**
	 * Internal function that does the actual finding to save time from re-running the above over and over
	 */
	function internalFind(results,selector,firstChar,attribute,value,supports,elem){
		while(elem!=null){
			/**
			 * Only run if this is actually an HTML element
			 */
			if(elem.nodeType==1){
				// If selector is a class
				if ( firstChar === '.' ) {
					if ( supports ) {
						if ( elem.classList.contains( selector.substr(1) ) ) {
							results.add(elem);
						}
					} else {
						if ( new RegExp('(^|\\s)' + selector.substr(1) + '(\\s|$)').test( elem.className ) ) {
							results.add(elem);
						}
					}
				}

				// If selector is an ID
				if ( firstChar === '#' ) {
					if ( elem.id === selector.substr(1) ) {
						results.add(elem);
					}
				}

				// If selector is a data attribute
				if ( firstChar === '[' ) {
					if ( elem.hasAttribute( attribute[0] ) ) {
						if ( value ) {
							if ( elem.getAttribute( attribute[0] ) === attribute[1] ) {
								results.add(elem);
							}
						} else {
							results.add(elem);
						}
					}
				}
				
				// If selector is a tag
				// We can use tagName now again becuase we check nodeType at the start
				// nodeName is better going forward tagName is for IE 5.5
				if ( elem.nodeName.toLowerCase() === selector ) {
					results.add(elem);
				}
				
				/**
				 * Move down recursively through all children
				 */
				if(elem.hasChildNodes()){
					internalFind(results,selector,firstChar,attribute,value,supports,elem.firstChild);
				}
			}
			/**
			 * Move on to next sibling if there is one
			 */
			elem = elem.nextSibling;
		}
	}
	internalFind(results,selector,firstChar,attribute,value,supports,elem);
	
	/**
	 * Link list used to store all results
	 */
	function list(){
		this.head = null;
		this.tail = null;
		this.length = 0;
		
		list.prototype.add = function(elem){
			var newNode = new node(elem);
			if (this.head===null){
				this.head = newNode;
			} else if(this.tail===null) {
				this.tail = newNode;
				this.head.next = newNode;
			} else {
				this.tail.next = newNode;
				this.tail = newNode;
			}
			this.length += 1;
		};
		
		/**
		 * Stores link list into an array and garbage collects itself
		 */
		list.prototype.print = function(){
			if(this.length<1){ return false; }
			var array = new Array(this.length);
			var index = 0;
			var current = this.head;
			var previous = current;
			while(current!=null){
				array[index] = current.value;
				current = current.next;
				previous.value = null;
				previous.next = null;
				previous = current;
				index++;
			}
			this.head = null;
			this.tail = null;
			this.length = null;
			return array;
		}
	}
	
	function node(elem){
		this.value = elem;
		this.next = null;
	}
	
	/**
	 * Return results stored in link list as an array or false if nothing was found
	 */
	return results.print();
}

/**
 * MD5 hash function
 * @author satazor
 * @link https://github.com/satazor/js-spark-md5/blob/master/spark-md5.js
 */
(function (factory) {
    if (typeof exports === 'object') {
        // Node/CommonJS
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD
        define(factory);
    } else {
        // Browser globals (with support for web workers)
        var glob;

        try {
            glob = window;
        } catch (e) {
            glob = self;
        }

        glob.MD5 = factory();
    }
}(function (undefined) {

    'use strict';

    /*
     * Fastest md5 implementation around (JKM md5).
     * Credits: Joseph Myers
     *
     * @see http://www.myersdaily.org/joseph/javascript/md5-text.html
     * @see http://jsperf.com/md5-shootout/7
     */

    /* this function is much faster,
      so if possible we use it. Some IEs
      are the only ones I know of that
      need the idiotic second function,
      generated by an if clause.  */
    var add32 = function (a, b) {
        return (a + b) & 0xFFFFFFFF;
    },
        hex_chr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];


    function cmn(q, a, b, x, s, t) {
        a = add32(add32(a, q), add32(x, t));
        return add32((a << s) | (a >>> (32 - s)), b);
    }

    function ff(a, b, c, d, x, s, t) {
        return cmn((b & c) | ((~b) & d), a, b, x, s, t);
    }

    function gg(a, b, c, d, x, s, t) {
        return cmn((b & d) | (c & (~d)), a, b, x, s, t);
    }

    function hh(a, b, c, d, x, s, t) {
        return cmn(b ^ c ^ d, a, b, x, s, t);
    }

    function ii(a, b, c, d, x, s, t) {
        return cmn(c ^ (b | (~d)), a, b, x, s, t);
    }

    function md5cycle(x, k) {
        var a = x[0],
            b = x[1],
            c = x[2],
            d = x[3];

        a = ff(a, b, c, d, k[0], 7, -680876936);
        d = ff(d, a, b, c, k[1], 12, -389564586);
        c = ff(c, d, a, b, k[2], 17, 606105819);
        b = ff(b, c, d, a, k[3], 22, -1044525330);
        a = ff(a, b, c, d, k[4], 7, -176418897);
        d = ff(d, a, b, c, k[5], 12, 1200080426);
        c = ff(c, d, a, b, k[6], 17, -1473231341);
        b = ff(b, c, d, a, k[7], 22, -45705983);
        a = ff(a, b, c, d, k[8], 7, 1770035416);
        d = ff(d, a, b, c, k[9], 12, -1958414417);
        c = ff(c, d, a, b, k[10], 17, -42063);
        b = ff(b, c, d, a, k[11], 22, -1990404162);
        a = ff(a, b, c, d, k[12], 7, 1804603682);
        d = ff(d, a, b, c, k[13], 12, -40341101);
        c = ff(c, d, a, b, k[14], 17, -1502002290);
        b = ff(b, c, d, a, k[15], 22, 1236535329);

        a = gg(a, b, c, d, k[1], 5, -165796510);
        d = gg(d, a, b, c, k[6], 9, -1069501632);
        c = gg(c, d, a, b, k[11], 14, 643717713);
        b = gg(b, c, d, a, k[0], 20, -373897302);
        a = gg(a, b, c, d, k[5], 5, -701558691);
        d = gg(d, a, b, c, k[10], 9, 38016083);
        c = gg(c, d, a, b, k[15], 14, -660478335);
        b = gg(b, c, d, a, k[4], 20, -405537848);
        a = gg(a, b, c, d, k[9], 5, 568446438);
        d = gg(d, a, b, c, k[14], 9, -1019803690);
        c = gg(c, d, a, b, k[3], 14, -187363961);
        b = gg(b, c, d, a, k[8], 20, 1163531501);
        a = gg(a, b, c, d, k[13], 5, -1444681467);
        d = gg(d, a, b, c, k[2], 9, -51403784);
        c = gg(c, d, a, b, k[7], 14, 1735328473);
        b = gg(b, c, d, a, k[12], 20, -1926607734);

        a = hh(a, b, c, d, k[5], 4, -378558);
        d = hh(d, a, b, c, k[8], 11, -2022574463);
        c = hh(c, d, a, b, k[11], 16, 1839030562);
        b = hh(b, c, d, a, k[14], 23, -35309556);
        a = hh(a, b, c, d, k[1], 4, -1530992060);
        d = hh(d, a, b, c, k[4], 11, 1272893353);
        c = hh(c, d, a, b, k[7], 16, -155497632);
        b = hh(b, c, d, a, k[10], 23, -1094730640);
        a = hh(a, b, c, d, k[13], 4, 681279174);
        d = hh(d, a, b, c, k[0], 11, -358537222);
        c = hh(c, d, a, b, k[3], 16, -722521979);
        b = hh(b, c, d, a, k[6], 23, 76029189);
        a = hh(a, b, c, d, k[9], 4, -640364487);
        d = hh(d, a, b, c, k[12], 11, -421815835);
        c = hh(c, d, a, b, k[15], 16, 530742520);
        b = hh(b, c, d, a, k[2], 23, -995338651);

        a = ii(a, b, c, d, k[0], 6, -198630844);
        d = ii(d, a, b, c, k[7], 10, 1126891415);
        c = ii(c, d, a, b, k[14], 15, -1416354905);
        b = ii(b, c, d, a, k[5], 21, -57434055);
        a = ii(a, b, c, d, k[12], 6, 1700485571);
        d = ii(d, a, b, c, k[3], 10, -1894986606);
        c = ii(c, d, a, b, k[10], 15, -1051523);
        b = ii(b, c, d, a, k[1], 21, -2054922799);
        a = ii(a, b, c, d, k[8], 6, 1873313359);
        d = ii(d, a, b, c, k[15], 10, -30611744);
        c = ii(c, d, a, b, k[6], 15, -1560198380);
        b = ii(b, c, d, a, k[13], 21, 1309151649);
        a = ii(a, b, c, d, k[4], 6, -145523070);
        d = ii(d, a, b, c, k[11], 10, -1120210379);
        c = ii(c, d, a, b, k[2], 15, 718787259);
        b = ii(b, c, d, a, k[9], 21, -343485551);

        x[0] = add32(a, x[0]);
        x[1] = add32(b, x[1]);
        x[2] = add32(c, x[2]);
        x[3] = add32(d, x[3]);
    }

    function md5blk(s) {
        var md5blks = [],
            i; /* Andy King said do it this way. */

        for (i = 0; i < 64; i += 4) {
            md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
        }
        return md5blks;
    }

    function md5blk_array(a) {
        var md5blks = [],
            i; /* Andy King said do it this way. */

        for (i = 0; i < 64; i += 4) {
            md5blks[i >> 2] = a[i] + (a[i + 1] << 8) + (a[i + 2] << 16) + (a[i + 3] << 24);
        }
        return md5blks;
    }

    function md51(s) {
        var n = s.length,
            state = [1732584193, -271733879, -1732584194, 271733878],
            i,
            length,
            tail,
            tmp,
            lo,
            hi;

        for (i = 64; i <= n; i += 64) {
            md5cycle(state, md5blk(s.substring(i - 64, i)));
        }
        s = s.substring(i - 64);
        length = s.length;
        tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (i = 0; i < length; i += 1) {
            tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
        }
        tail[i >> 2] |= 0x80 << ((i % 4) << 3);
        if (i > 55) {
            md5cycle(state, tail);
            for (i = 0; i < 16; i += 1) {
                tail[i] = 0;
            }
        }

        // Beware that the final length might not fit in 32 bits so we take care of that
        tmp = n * 8;
        tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
        lo = parseInt(tmp[2], 16);
        hi = parseInt(tmp[1], 16) || 0;

        tail[14] = lo;
        tail[15] = hi;

        md5cycle(state, tail);
        return state;
    }

    function md51_array(a) {
        var n = a.length,
            state = [1732584193, -271733879, -1732584194, 271733878],
            i,
            length,
            tail,
            tmp,
            lo,
            hi;

        for (i = 64; i <= n; i += 64) {
            md5cycle(state, md5blk_array(a.subarray(i - 64, i)));
        }

        // Not sure if it is a bug, however IE10 will always produce a sub array of length 1
        // containing the last element of the parent array if the sub array specified starts
        // beyond the length of the parent array - weird.
        // https://connect.microsoft.com/IE/feedback/details/771452/typed-array-subarray-issue
        a = (i - 64) < n ? a.subarray(i - 64) : new Uint8Array(0);

        length = a.length;
        tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (i = 0; i < length; i += 1) {
            tail[i >> 2] |= a[i] << ((i % 4) << 3);
        }

        tail[i >> 2] |= 0x80 << ((i % 4) << 3);
        if (i > 55) {
            md5cycle(state, tail);
            for (i = 0; i < 16; i += 1) {
                tail[i] = 0;
            }
        }

        // Beware that the final length might not fit in 32 bits so we take care of that
        tmp = n * 8;
        tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
        lo = parseInt(tmp[2], 16);
        hi = parseInt(tmp[1], 16) || 0;

        tail[14] = lo;
        tail[15] = hi;

        md5cycle(state, tail);

        return state;
    }

    function rhex(n) {
        var s = '',
            j;
        for (j = 0; j < 4; j += 1) {
            s += hex_chr[(n >> (j * 8 + 4)) & 0x0F] + hex_chr[(n >> (j * 8)) & 0x0F];
        }
        return s;
    }

    function hex(x) {
        var i;
        for (i = 0; i < x.length; i += 1) {
            x[i] = rhex(x[i]);
        }
        return x.join('');
    }

    // In some cases the fast add32 function cannot be used..
    if (hex(md51('hello')) !== '5d41402abc4b2a76b9719d911017c592') {
        add32 = function (x, y) {
            var lsw = (x & 0xFFFF) + (y & 0xFFFF),
                msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xFFFF);
        };
    }

    // ---------------------------------------------------

    /**
     * ArrayBuffer slice polyfill.
     *
     * @see https://github.com/ttaubert/node-arraybuffer-slice
     */

    if (typeof ArrayBuffer !== 'undefined' && !ArrayBuffer.prototype.slice) {
        (function () {
            function clamp(val, length) {
                val = (val | 0) || 0;

                if (val < 0) {
                    return Math.max(val + length, 0);
                }

                return Math.min(val, length);
            }

            ArrayBuffer.prototype.slice = function (from, to) {
                var length = this.byteLength,
                    begin = clamp(from, length),
                    end = length,
                    num,
                    target,
                    targetArray,
                    sourceArray;

                if (to !== undefined) {
                    end = clamp(to, length);
                }

                if (begin > end) {
                    return new ArrayBuffer(0);
                }

                num = end - begin;
                target = new ArrayBuffer(num);
                targetArray = new Uint8Array(target);

                sourceArray = new Uint8Array(this, begin, num);
                targetArray.set(sourceArray);

                return target;
            };
        })();
    }

    // ---------------------------------------------------

    /**
     * Helpers.
     */

    function toUtf8(str) {
        if (/[\u0080-\uFFFF]/.test(str)) {
            str = unescape(encodeURIComponent(str));
        }

        return str;
    }

    function utf8Str2ArrayBuffer(str, returnUInt8Array) {
        var length = str.length,
           buff = new ArrayBuffer(length),
           arr = new Uint8Array(buff),
           i;

        for (i = 0; i < length; i += 1) {
            arr[i] = str.charCodeAt(i);
        }

        return returnUInt8Array ? arr : buff;
    }

    function arrayBuffer2Utf8Str(buff) {
        return String.fromCharCode.apply(null, new Uint8Array(buff));
    }

    function concatenateArrayBuffers(first, second, returnUInt8Array) {
        var result = new Uint8Array(first.byteLength + second.byteLength);

        result.set(new Uint8Array(first));
        result.set(new Uint8Array(second), first.byteLength);

        return returnUInt8Array ? result : result.buffer;
    }

    function hexToBinaryString(hex) {
        var bytes = [],
            length = hex.length,
            x;

        for (x = 0; x < length - 1; x += 2) {
            bytes.push(parseInt(hex.substr(x, 2), 16));
        }

        return String.fromCharCode.apply(String, bytes);
    }

    // ---------------------------------------------------

    /**
     * MD5 OOP implementation.
     *
     * Use this class to perform an incremental md5, otherwise use the
     * static methods instead.
     */

    function MD5() {
        // call reset to init the instance
        this.reset();
    }

    /**
     * Appends a string.
     * A conversion will be applied if an utf8 string is detected.
     *
     * @param {String} str The string to be appended
     *
     * @return {MD5} The instance itself
     */
    MD5.prototype.append = function (str) {
        // Converts the string to utf8 bytes if necessary
        // Then append as binary
        this.appendBinary(toUtf8(str));

        return this;
    };

    /**
     * Appends a binary string.
     *
     * @param {String} contents The binary string to be appended
     *
     * @return {MD5} The instance itself
     */
    MD5.prototype.appendBinary = function (contents) {
        this._buff += contents;
        this._length += contents.length;

        var length = this._buff.length,
            i;

        for (i = 64; i <= length; i += 64) {
            md5cycle(this._hash, md5blk(this._buff.substring(i - 64, i)));
        }

        this._buff = this._buff.substring(i - 64);

        return this;
    };

    /**
     * Finishes the incremental computation, reseting the internal state and
     * returning the result.
     *
     * @param {Boolean} raw True to get the raw string, false to get the hex string
     *
     * @return {String} The result
     */
    MD5.prototype.end = function (raw) {
        var buff = this._buff,
            length = buff.length,
            i,
            tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            ret;

        for (i = 0; i < length; i += 1) {
            tail[i >> 2] |= buff.charCodeAt(i) << ((i % 4) << 3);
        }

        this._finish(tail, length);
        ret = hex(this._hash);

        if (raw) {
            ret = hexToBinaryString(ret);
        }

        this.reset();

        return ret;
    };

    /**
     * Resets the internal state of the computation.
     *
     * @return {MD5} The instance itself
     */
    MD5.prototype.reset = function () {
        this._buff = '';
        this._length = 0;
        this._hash = [1732584193, -271733879, -1732584194, 271733878];

        return this;
    };

    /**
     * Gets the internal state of the computation.
     *
     * @return {Object} The state
     */
    MD5.prototype.getState = function () {
        return {
            buff: this._buff,
            length: this._length,
            hash: this._hash
        };
    };

    /**
     * Gets the internal state of the computation.
     *
     * @param {Object} state The state
     *
     * @return {MD5} The instance itself
     */
    MD5.prototype.setState = function (state) {
        this._buff = state.buff;
        this._length = state.length;
        this._hash = state.hash;

        return this;
    };

    /**
     * Releases memory used by the incremental buffer and other additional
     * resources. If you plan to use the instance again, use reset instead.
     */
    MD5.prototype.destroy = function () {
        delete this._hash;
        delete this._buff;
        delete this._length;
    };

    /**
     * Finish the final calculation based on the tail.
     *
     * @param {Array}  tail   The tail (will be modified)
     * @param {Number} length The length of the remaining buffer
     */
    MD5.prototype._finish = function (tail, length) {
        var i = length,
            tmp,
            lo,
            hi;

        tail[i >> 2] |= 0x80 << ((i % 4) << 3);
        if (i > 55) {
            md5cycle(this._hash, tail);
            for (i = 0; i < 16; i += 1) {
                tail[i] = 0;
            }
        }

        // Do the final computation based on the tail and length
        // Beware that the final length may not fit in 32 bits so we take care of that
        tmp = this._length * 8;
        tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
        lo = parseInt(tmp[2], 16);
        hi = parseInt(tmp[1], 16) || 0;

        tail[14] = lo;
        tail[15] = hi;
        md5cycle(this._hash, tail);
    };

    /**
     * Performs the md5 hash on a string.
     * A conversion will be applied if utf8 string is detected.
     *
     * @param {String}  str The string
     * @param {Boolean} raw True to get the raw string, false to get the hex string
     *
     * @return {String} The result
     */
    MD5.hash = function (str, raw) {
        // Converts the string to utf8 bytes if necessary
        // Then compute it using the binary function
        return MD5.hashBinary(toUtf8(str), raw);
    };

    /**
     * Performs the md5 hash on a binary string.
     *
     * @param {String}  content The binary string
     * @param {Boolean} raw     True to get the raw string, false to get the hex string
     *
     * @return {String} The result
     */
    MD5.hashBinary = function (content, raw) {
        var hash = md51(content),
            ret = hex(hash);

        return raw ? hexToBinaryString(ret) : ret;
    };

    // ---------------------------------------------------

    /**
     * MD5 OOP implementation for array buffers.
     *
     * Use this class to perform an incremental md5 ONLY for array buffers.
     */
    MD5.ArrayBuffer = function () {
        // call reset to init the instance
        this.reset();
    };

    /**
     * Appends an array buffer.
     *
     * @param {ArrayBuffer} arr The array to be appended
     *
     * @return {MD5.ArrayBuffer} The instance itself
     */
    MD5.ArrayBuffer.prototype.append = function (arr) {
        var buff = concatenateArrayBuffers(this._buff.buffer, arr, true),
            length = buff.length,
            i;

        this._length += arr.byteLength;

        for (i = 64; i <= length; i += 64) {
            md5cycle(this._hash, md5blk_array(buff.subarray(i - 64, i)));
        }

        this._buff = (i - 64) < length ? new Uint8Array(buff.buffer.slice(i - 64)) : new Uint8Array(0);

        return this;
    };

    /**
     * Finishes the incremental computation, reseting the internal state and
     * returning the result.
     *
     * @param {Boolean} raw True to get the raw string, false to get the hex string
     *
     * @return {String} The result
     */
    MD5.ArrayBuffer.prototype.end = function (raw) {
        var buff = this._buff,
            length = buff.length,
            tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            i,
            ret;

        for (i = 0; i < length; i += 1) {
            tail[i >> 2] |= buff[i] << ((i % 4) << 3);
        }

        this._finish(tail, length);
        ret = hex(this._hash);

        if (raw) {
            ret = hexToBinaryString(ret);
        }

        this.reset();

        return ret;
    };

    /**
     * Resets the internal state of the computation.
     *
     * @return {MD5.ArrayBuffer} The instance itself
     */
    MD5.ArrayBuffer.prototype.reset = function () {
        this._buff = new Uint8Array(0);
        this._length = 0;
        this._hash = [1732584193, -271733879, -1732584194, 271733878];

        return this;
    };

    /**
     * Gets the internal state of the computation.
     *
     * @return {Object} The state
     */
    MD5.ArrayBuffer.prototype.getState = function () {
        var state = MD5.prototype.getState.call(this);

        // Convert buffer to a string
        state.buff = arrayBuffer2Utf8Str(state.buff);

        return state;
    };

    /**
     * Gets the internal state of the computation.
     *
     * @param {Object} state The state
     *
     * @return {MD5.ArrayBuffer} The instance itself
     */
    MD5.ArrayBuffer.prototype.setState = function (state) {
        // Convert string to buffer
        state.buff = utf8Str2ArrayBuffer(state.buff, true);

        return MD5.prototype.setState.call(this, state);
    };

    MD5.ArrayBuffer.prototype.destroy = MD5.prototype.destroy;

    MD5.ArrayBuffer.prototype._finish = MD5.prototype._finish;

    /**
     * Performs the md5 hash on an array buffer.
     *
     * @param {ArrayBuffer} arr The array buffer
     * @param {Boolean}     raw True to get the raw string, false to get the hex one
     *
     * @return {String} The result
     */
    MD5.ArrayBuffer.hash = function (arr, raw) {
        var hash = md51_array(new Uint8Array(arr)),
            ret = hex(hash);

        return raw ? hexToBinaryString(ret) : ret;
    };

    return MD5;
}));

/**
 * Check if DOM is ready cross-browser compatible vanilla javascript function
 * @author Timo Huovinen
 * @link http://stackoverflow.com/a/7053197/3193156
 */
var ready = (function(){

    var readyList,
        DOMContentLoaded,
        class2type = {};
        class2type["[object Boolean]"] = "boolean";
        class2type["[object Number]"] = "number";
        class2type["[object String]"] = "string";
        class2type["[object Function]"] = "function";
        class2type["[object Array]"] = "array";
        class2type["[object Date]"] = "date";
        class2type["[object RegExp]"] = "regexp";
        class2type["[object Object]"] = "object";

    var ReadyObj = {
        // Is the DOM ready to be used? Set to true once it occurs.
        isReady: false,
        // A counter to track how many items to wait for before
        // the ready event fires. See #6781
        readyWait: 1,
        // Hold (or release) the ready event
        holdReady: function( hold ) {
            if ( hold ) {
                ReadyObj.readyWait++;
            } else {
                ReadyObj.ready( true );
            }
        },
        // Handle when the DOM is ready
        ready: function( wait ) {
            // Either a released hold or an DOMready/load event and not yet ready
            if ( (wait === true && !--ReadyObj.readyWait) || (wait !== true && !ReadyObj.isReady) ) {
                // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
                if ( !document.body ) {
                    return setTimeout( ReadyObj.ready, 1 );
                }

                // Remember that the DOM is ready
                ReadyObj.isReady = true;
                // If a normal DOM Ready event fired, decrement, and wait if need be
                if ( wait !== true && --ReadyObj.readyWait > 0 ) {
                    return;
                }
                // If there are functions bound, to execute
                readyList.resolveWith( document, [ ReadyObj ] );

                // Trigger any bound ready events
                //if ( ReadyObj.fn.trigger ) {
                //    ReadyObj( document ).trigger( "ready" ).unbind( "ready" );
                //}
            }
        },
        bindReady: function() {
            if ( readyList ) {
                return;
            }
            readyList = ReadyObj._Deferred();

            // Catch cases where $(document).ready() is called after the
            // browser event has already occurred.
            if ( document.readyState === "complete" ) {
                // Handle it asynchronously to allow scripts the opportunity to delay ready
                return setTimeout( ReadyObj.ready, 1 );
            }

            // Mozilla, Opera and webkit nightlies currently support this event
            if ( document.addEventListener ) {
                // Use the handy event callback
                document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );
                // A fallback to window.onload, that will always work
                window.addEventListener( "load", ReadyObj.ready, false );

            // If IE event model is used
            } else if ( document.attachEvent ) {
                // ensure firing before onload,
                // maybe late but safe also for iframes
                document.attachEvent( "onreadystatechange", DOMContentLoaded );

                // A fallback to window.onload, that will always work
                window.attachEvent( "onload", ReadyObj.ready );

                // If IE and not a frame
                // continually check to see if the document is ready
                var toplevel = false;

                try {
                    toplevel = window.frameElement == null;
                } catch(e) {}

                if ( document.documentElement.doScroll && toplevel ) {
                    doScrollCheck();
                }
            }
        },
        _Deferred: function() {
            var // callbacks list
                callbacks = [],
                // stored [ context , args ]
                fired,
                // to avoid firing when already doing so
                firing,
                // flag to know if the deferred has been cancelled
                cancelled,
                // the deferred itself
                deferred  = {

                    // done( f1, f2, ...)
                    done: function() {
                        if ( !cancelled ) {
                            var args = arguments,
                                i,
                                length,
                                elem,
                                type,
                                _fired;
                            if ( fired ) {
                                _fired = fired;
                                fired = 0;
                            }
                            for ( i = 0, length = args.length; i < length; i++ ) {
                                elem = args[ i ];
                                type = ReadyObj.type( elem );
                                if ( type === "array" ) {
                                    deferred.done.apply( deferred, elem );
                                } else if ( type === "function" ) {
                                    callbacks.push( elem );
                                }
                            }
                            if ( _fired ) {
                                deferred.resolveWith( _fired[ 0 ], _fired[ 1 ] );
                            }
                        }
                        return this;
                    },

                    // resolve with given context and args
                    resolveWith: function( context, args ) {
                        if ( !cancelled && !fired && !firing ) {
                            // make sure args are available (#8421)
                            args = args || [];
                            firing = 1;
                            try {
                                while( callbacks[ 0 ] ) {
                                    callbacks.shift().apply( context, args );//shifts a callback, and applies it to document
                                }
                            }
                            finally {
                                fired = [ context, args ];
                                firing = 0;
                            }
                        }
                        return this;
                    },

                    // resolve with this as context and given arguments
                    resolve: function() {
                        deferred.resolveWith( this, arguments );
                        return this;
                    },

                    // Has this deferred been resolved?
                    isResolved: function() {
                        return !!( firing || fired );
                    },

                    // Cancel
                    cancel: function() {
                        cancelled = 1;
                        callbacks = [];
                        return this;
                    }
                };

            return deferred;
        },
        type: function( obj ) {
            return obj == null ?
                String( obj ) :
                class2type[ Object.prototype.toString.call(obj) ] || "object";
        }
    }
    // The DOM ready check for Internet Explorer
    function doScrollCheck() {
        if ( ReadyObj.isReady ) {
            return;
        }

        try {
            // If IE is used, use the trick by Diego Perini
            // http://javascript.nwbox.com/IEContentLoaded/
            document.documentElement.doScroll("left");
        } catch(e) {
            setTimeout( doScrollCheck, 1 );
            return;
        }

        // and execute any waiting functions
        ReadyObj.ready();
    }
    // Cleanup functions for the document ready method
    if ( document.addEventListener ) {
        DOMContentLoaded = function() {
            document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
            ReadyObj.ready();
        };

    } else if ( document.attachEvent ) {
        DOMContentLoaded = function() {
            // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
            if ( document.readyState === "complete" ) {
                document.detachEvent( "onreadystatechange", DOMContentLoaded );
                ReadyObj.ready();
            }
        };
    }
    function ready( fn ) {
        // Attach the listeners
        ReadyObj.bindReady();

        var type = ReadyObj.type( fn );

        // Add the callback
        readyList.done( fn );//readyList is result of _Deferred()
    }
    return ready;
})();


/**
* Functions related to the memory match game application start here 
*/
function loadMemoryGame() {

    var cards = choosenTopic;
    var size = null;
    var shuffledCards = null;
    moveCounter = 0;

    cards = storage.getFlashCards(cards);
    size = cards.length * 2;
    shuffledCards = shuffleCards(cards);
    
    createNewBoard(size, shuffledCards, cards);
    getData("http://cit261.creatingux.com/watch/index.html");

}

function createNewBoard(size, shuffledCards, cards) {
    
    var board = document.createElement("div");
    var content = document.getElementById("content");
    var card = null;
    var front = null;
    var back = null;
    var result = null;
    var watchDiv = null;
    var watch = null;
    var timer = null;

    content.innerHTML = "";
    board.id = "memory-board";

    result = document.createElement("div");
    result.id = "result";
    watchDiv = document.createElement("div");
    watchDiv.id = "watch";

    board.appendChild(result);
    board.appendChild(watchDiv);

    for (var i = 0; i < size; i++) {
        card = document.createElement("div");
        front = document.createElement("div");
        back = document.createElement("div");

        card.id = i;

        front.className = "front";
        back.className = "back";
        card.className = "card";

        content.appendChild(board);
        board.appendChild(card);
        card.appendChild(front);
        card.appendChild(back);
        

        card.addEventListener("click", function () {
        	
        	if (timer == null){

        		timer = document.getElementById('timer');
    			watch = new Stopwatch(timer);
    		
    		}

        	if (!watch.isOn){
    			watch.start();
    		}
        	
        	if (this.firstChild.className == "correct"){
        		return;
        	}

            document.getElementById("result").innerHTML="";
            flipCard(this, shuffledCards, cards);
            
            var done = document.getElementsByClassName("correct");
            
            if (done.length == size){
            	result = document.getElementById("result");
            	result.innerHTML="You have finished in "+ moveCounter + " moves!";
            	result.id = "winner";
            	result.className = "winner";

            	if (result.className == "winner"){
            		watch.stop();
            		//watch.reset();
           		}
            }
        });
    }
}

function flipCard(card, shuffledCards, cards) {
	
    var par = document.createElement("div");
    var flippedCards = [];
    var count = 0;
    var showedCards = null;
    var sub = null;
    var complete = null;
    var completeNext = null;
    var fullSentence = null;

    flippedCards.push(card.id);

    count = document.getElementsByClassName("flipped").length;

    if (count >= 2) {
        return;
    }

    card.firstChild.className = "flipped";
    card.firstChild.appendChild(par);
    
    count = document.getElementsByClassName("flipped").length;
    showedCards = document.getElementsByClassName("flipped");
    
	sub = addElipse(shuffledCards[card.id]);
	if (sub === null){
		card.firstChild.firstChild.innerHTML = shuffledCards[card.id];
	}else{
		card.firstChild.firstChild.innerHTML = sub+" ...";
		fullSentence = shuffledCards[card.id];
		var result = document.getElementById("result");
		result.innerHTML = "Full Text: "+ fullSentence;
	}

    if (count == 2) {
        var number = showedCards[0].parentNode.id;
        var number2 = showedCards[1].parentNode.id;
        var valid = convert(card, cards, shuffledCards, number, number2);

        moveCounter = moveCounter+1;

        if (valid == false) {

            function flipBack() {
                for (var i = 0; i <= flippedCards.length; i++) {
                    showedCards[0].innerHTML = "";
                    showedCards[0].className = "front";
                }
            }
            setTimeout(flipBack, 2000);
        }
    }
}


function convert(card, cards, shuffledCards, number, number2) {
   	var flippedCards = document.getElementsByClassName("flipped");	
    var term = null;
    var definition = null;
    var completeNext = null;
    var complete = null;
    var valid = false;
    var j = 0;

    for (var i = 0; i < cards.length; i++) {
        term = cards[i].term;
        definition = cards[i].definition;


        complete = shuffledCards[number];
        completeNext = shuffledCards[number2];

        if (term == complete || definition == complete) {
            if (term == completeNext || definition == completeNext) {
                valid = true;
                flippedCards[0].className = "correct";
                flippedCards[0].className = "correct";
                return valid;
            }
        }
    }
    return valid;
}


function shuffleCards(cards) {
    var replacedCard = null;
    var randomNumber = 0;
    var data = [];
    var temp = null;

    for (var i = 0; i < cards.length; i++) {
        data.push(cards[i].term);
        data.push(cards[i].definition);
    }

    for (var i = 0; i < data.length; i++) {
        randomNumber = Math.floor(Math.random() * data.length);
        temp = data[i];
        data[i] = data[randomNumber];
        data[randomNumber] = temp;
    }
    return data;
}

function addElipse(word){
	var white = 0;
	var sub = null;

	if (word.length>54){

		word = word.trim();
		sub = word.substring(0,53);
		white = sub.lastIndexOf(" ");
		sub = word.substring(0,white);
	}

	return sub;
}


function Stopwatch(elem) {
  var time = 0;
  var interval;
  var offset;

  function update() {
    if (this.isOn) {
      var timePassed = delta();
      time += timePassed;
    }

    var formattedTime = timeFormatter(time);
    elem.textContent = formattedTime;
  }

  function delta() {
    var now = Date.now();
    var timePassed = now - offset;
    offset = now;
    return timePassed;
  }

  function timeFormatter(timeInMilliseconds) {
    var time = new Date(timeInMilliseconds);
    var minutes = time.getMinutes().toString();
    var seconds = time.getSeconds().toString();
    var milliseconds = time.getMilliseconds().toString();

    milliseconds = milliseconds.substring(0,2);

    if (minutes.length < 2) {
      minutes = '0' + minutes;
    }

    if (seconds.length < 2) {
      seconds = '0' + seconds;
    }

    while (milliseconds.length < 2) {
      milliseconds = '0' + milliseconds;
    }

    return minutes + ' : ' + seconds + ' : ' + milliseconds;
  }

  this.isOn = false;

  this.start = function() {
    if (!this.isOn) {
      interval = setInterval(update.bind(this), 10);
      offset = Date.now();
      this.isOn = true;
    }
  };

  this.stop = function() {
    if (this.isOn) {
      clearInterval(interval);
      interval = null;
      this.isOn = false;
    }
  };

  this.reset = function() {
    time = 0;
    update();
  };
}



function getData(url){
     
  if (window.XMLHttpRequest) {
    // code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp = new XMLHttpRequest();
  } else { // code for IE6, IE5
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  
  xmlhttp.onreadystatechange=function() {
    
    if (xmlhttp.readyState===4 && xmlhttp.status===200) {
      document.getElementById("watch").innerHTML=xmlhttp.responseText;
    }
  };
  xmlhttp.open("GET",url,true);
  xmlhttp.send();
}

/**
* Functions related to the memory match game end here
*/


function createFlashCards() {
    document.getElementById('content').innerHTML = "";

    var current = choosenTopic.head; // This grabs the head value of your flashCardSet list which is a flashCards object (link)
    var html = "<div id='cards'><div id='back' onclick='back(null)'><i class='fa fa-chevron-left'></i></div>";
    var i = 1;
    var next = 0;
	while(current!==null){
            // creates each card
            html += "<div id='" + i + "' class='invisible' onclick='flip(\"back\", \"" + current.definition + "\")'>";
            html += "<p class='frontText'>" + current.term + "</p>";
            html += "<p class='invisibleText'>" + current.definition + "</p></div>"
            i++;
            current = current.next; // Make sure to move on to the next record or you'll create an infinite loop
	}
    html += "<div id='next' onclick='next(2)'><i class='fa fa-chevron-right'></i></div></div>";
    document.getElementById('content').innerHTML = html;
    slideIn(1);
    
}

function slideIn(id) {
    var card = document.getElementById(id);// this grabs the desired card
    card.setAttribute("class", "front"); // this changes the card from invisible to show front
    
}

function slideOut(id) {
    var card = document.getElementById(id);// this grabs the desired card
    card.setAttribute("class", "invisible"); // this changes the card from invisible to show front
    
}

function back(i) {
    var nextCard = document.getElementById(i);
    if (nextCard == null) {
        return;
    } else {
        var currentId = i + 1;
        slideOut(currentId);
        slideIn(i);
        var backId = i - 1;
        var replacmentForBackButton = "back(" + backId + ")";
        var backButton = document.getElementById('back');
        backButton.setAttribute("onclick", replacmentForBackButton);
        var replacmentForNextButton = "next(" + currentId + ")";
        var nextButton = document.getElementById('next');
        nextButton.setAttribute("onclick", replacmentForNextButton);
    }
}

function next(i) {
    var nextCard = document.getElementById(i);
    if (nextCard == null) {
        return;
    } else {
        var currentId = i - 1;
        slideOut(currentId);
        slideIn(i);
        var nextId = i + 1;
        var replacmentForNextButton = "next(" + nextId + ")";
        var nextButton = document.getElementById('next');
        nextButton.setAttribute("onclick", replacmentForNextButton);
        var replacmentForBackButton = "back(" + currentId + ")";
        var backButton = document.getElementById('back');
        backButton.setAttribute("onclick", replacmentForBackButton);
    }
}

function flip(side, textInput) {
    var card = null;
    var done = false;
    for (var i = 1; done == false; i++) {
        card =  document.getElementById(i);
        var classType = card.getAttribute('class');
        if (classType != "invisible") {
            done = true;
        }
    }
    var currentText = card.childNodes[0].childNodes[0].nodeValue;
    var currentc = 'flip("' + card.getAttribute('class') + '", "' + currentText + '")';
    card.setAttribute('onclick', currentc);
    var text = document.createTextNode(textInput);
    card.setAttribute('class', side); 
   setTimeout(function(){ card.childNodes[0].replaceChild(text, card.childNodes[0].childNodes[0]); if (side == 'back') { card.childNodes[0].setAttribute('class', side);} else card.childNodes[0].setAttribute('class', ''); }, 250);
      
      
}


/**
 * PLACE ANY FUNCTIONS THAT NEED TO RUN ON PAGE LOAD INSIDE HERE
 * DO NOT PLAVE ANY OTHER CODE BELOW THIS FUNCTION!!!
 */
ready(function(){
	/**
	 * Make global storage object so we all can use local storage
	 */
	storage = new storage();
	
	/**
	 * Global variable to hold the users subject list
	 * Load the first page or create an empty object so we're ready for the user to add subjects
	 */
	subjects = null;
	loadSubjects();
	
	/**
	 * Global variable to track which subject we are in
	 */
	choosenSubject = null;
	
	/**
	 * Global variable to track which topic we are in. This is when a user clicks
	 * on a topic from the choosen subject
	 */
	choosenTopic = null;
	
	/**
	 * Load game links
	 */
	genGameLinks();

	/**
	 * Count Moves
	 */	
	moveCounter = null;
});
/**
 *  DO NOT PLAVE ANY OTHER CODE BELOW THIS FUNCTION!!!
 */