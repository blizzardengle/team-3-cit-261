/**
 * Search down the DOM tree for all matches of a provided selector. Unless an optional
 * starting parameter is given the function will default to the document body.
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
			if (this.head==null){
				this.head = new node(elem);
				this.length += 1;
			} else if(this.tail==null) {
				this.head.next = new node(elem);
				this.tail = this.head.next;
				this.length += 1;
			} else {
				this.tail.next = new node(elem);
				this.tail = this.tail.next;
				this.length += 1;
			}
		}
		
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
 * Manage button clicks
 */
function manager(selector){
	if (selector!=null){
		var array = find(selector);
		if(array!=false){
			var len = array.length;
			for (var x=0;x<len;x++){
				array[x].style.backgroundColor = "#F9FF9A";
				setTimeout(clear.bind(null,array[x]),4000);
			}
		} else {
			console.log("Your search of the DOM found nothing.");
			alert("Your search of the DOM found nothing.");
		}
	} else {
		console.log("You did not setup the HTML code correctly.");
		alert("You did not setup the HTML code correctly.");
	}
}

/**
 * Remove the yellow backgound color the manager() function put on matches
 * @param {type} elem
 */
function clear(elem){
	elem.style.backgroundColor = "";
}