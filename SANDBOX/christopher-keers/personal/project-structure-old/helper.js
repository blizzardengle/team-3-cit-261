
/**
 * A little function to help teach how to use lists
 */
function printCards(){
	
	/**
	 * You will always deal with the global variable: choosenTopic which returns
	 * a flashCardSet object; really this is an object being used as a list
	 */
	var current = choosenTopic.head; // This grabs the head value of your flashCardSet list which is a flashCards object (link)
	
	while(current!==null){
		console.log("Term:       "+current.term);
		console.log("Definition: "+current.definition);
		console.log("Type:       "+current.type);
		console.log("-------------------------------");
		current = current.next; // Make sure to move on to the next record or you'll create an infinite loop
	}
}

function flashCardSetCLONE(name,filename){
	this.name = name;					// <=== THE ONLY THINGS YOU NEED
	this.filename = filename;
	this.head = null;					// <=== THE ONLY THINGS YOU NEED ( flashCards object )
	this.tail = null;					// <=== THE ONLY THINGS YOU NEED ( flashCards onject )
	this.length = 0;					// <=== THE ONLY THINGS YOU NEED
}
flashCardSetCLONE.prototype = {

	add: function(term,definition,type){
		// ...
	},

	remove: function(id){
		// ...
	},

	deserialize: function(flatObj){
		// ...
	},

	serialize: function(){
		// ...
	}
};

function flashCardsCLONE(term,definition,type,id){
	this.term = term;					// <=== THE ONLY THINGS YOU NEED
	this.definition = definition;		// <=== THE ONLY THINGS YOU NEED
	this.id = id || generateId();
	this.type = type || 0;				// <=== THE ONLY THINGS YOU NEED
	this.next = null;					// <=== THE ONLY THINGS YOU NEED ( flashCards object )
	this.previous = null;				// <=== THE ONLY THINGS YOU NEED ( flashcards object )
}