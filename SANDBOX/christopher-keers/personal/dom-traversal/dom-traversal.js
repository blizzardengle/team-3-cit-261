/**
 * All of this code originally came from the article "Climbing up and down the DOM tree with vanilla JavaScript".
 * @author Chris Ferdinandi
 * @link http://gomakethings.com/climbing-up-and-down-the-dom-tree-with-vanilla-javascript/
 * 
 * The code was very broken when I first came across it so I have fixed it and submited changes to Chris.
 * Since my changes he has gone dark (didn't return my email) and disabled comments on the article.
 * I comment on this changes in the function descriptions as well as with <=== at major changes
 * @author Chris Keers
 * @link http://caboodletech.com
 */ 
 
/**
 * Get the closest matching element up the DOM tree.
 * [ CHANGE LOG (FIXES) ] 
 *	>	I removed the for loop and replaced it with a while loop to simplify things (Next step requires it)
 *	>	Modified the code to search siblings climbing up the dom; old code jumped only to parents skipping everything
 *	>	I added a previous element variable to track when were done checking siblings, then allow the jump to the parent
 *	>	Completly recoded searching for attributes, this feature was totally broken
 * @param  {Element} elem     Starting element
 * @param  {String}  selector Selector to match against (class, ID, data attribute, or tag)
 * @return {Boolean|Element}  Returns null if not match found
 */
var closest = function ( elem, selector ) {
			
	// Variables
	var firstChar = selector.charAt(0);
	var supports = 'classList' in document.documentElement;
	var attribute, value, previous; // <=== ADDED PREVIOUS
	
	// If selector is a data attribute attempt to split the attribute from the value, there may not be a value
	if ( firstChar === '[' ) {
		selector = selector.substr( 1, selector.length - 1 ); // <=== -2 was changed to -1 so the value does not get chopped if there is a value
		attribute = selector.split( '=' );
		if ( attribute.length > 1 ) {
			value = true;
			attribute[1] = attribute[1].replace( /"/g, '' ).replace( /'/g, '' );
		}
		attribute[0] = attribute[0].substr( 0,attribute[0].length - 1 ); // <=== CHANGED from the code I originaly commented on your site, this is better
		// <=== This removes the ] left on the attribute, we had to leave it on in case there was a value
	}

	// Get closest match
	while (elem && elem !== document && elem.nodeType === 1){ // <== Change to a while loop
		
		// If selector is a class
		if ( firstChar === '.' ) {
			if ( supports ) {
				if ( elem.classList.contains( selector.substr(1) ) ) {
					return elem;
				}
			} else {
				if ( new RegExp('(^|\\s)' + selector.substr(1) + '(\\s|$)').test( elem.className ) ) {
					return elem;
				}
			}
		}

		// If selector is an ID
		if ( firstChar === '#' ) {
			if ( elem.id === selector.substr(1) ) {
				return elem;
			}
		}

		// If selector is a data attribute
		if ( firstChar === '[' ) {
			if ( elem.hasAttribute( attribute[0] ) ) {
				if ( value ) {
					if ( elem.getAttribute( attribute[0] ) === attribute[1] ) {
						return elem;
					}
				} else {
					return elem;
				}
			}
		}

		// If selector is a tag
		if ( elem.tagName.toLowerCase() === selector ) {
			return elem;
		}
		
		// <=== Climb up to previous element (sibling)
		previous = elem; // <=== We have to save the previous element or else we wont be able to make the jump to the parent
		elem = elem.previousElementSibling;
		if(elem==null){ elem = previous.parentNode}; // <=== If there are no more siblings go to the parent and keep climbing
	}
	
	return null;
			
}

/**
 * Get all DOM element up the tree that contain a class, ID, or data attribute
 * [ CHANGE LOG (FIXES) ]
 *  >	I removed the for loop and replaced it with a while loop to simplify things (Next step requires it)
 *	>	Modified the code to search siblings climbing up the dom; old code jumped only to parents skipping everything
 *	>	Completly recoded searching for attributes, this feature was totally broken
 *	>	Attribute search supports looking for an attribute equal to a value now
 * @param  {Node} elem The base element
 * @param  {String} selector The class, id, data attribute, or tag to look for
 * @return {Array} Null if no match
 */
var getParents = function (elem, selector) {

    var parents = [];
    var firstChar, value, previous; // <=== ADDED VALUE
    if ( selector ) {
        firstChar = selector.charAt(0);
    }
	
	// If selector is a data attribute attempt to split the attribute from the value, there may not be a value
	if ( firstChar === '[' ) {
		selector = selector.substr( 1, selector.length - 1 ); // <=== -2 was changed to -1 so the value does not get chopped if there is a value
		attribute = selector.split( '=' );
		if ( attribute.length > 1 ) {
			value = true;
			attribute[1] = attribute[1].replace( /"/g, '' ).replace( /'/g, '' );
		}
		attribute[0] = attribute[0].substr( 0,attribute[0].length - 1 ); // <=== CHANGED from the code I originaly commented on your site, this is better
		// <=== This removes the ] left on the attribute, we had to leave it on in case there was a value
	}

    // Get matches
    while (elem && elem !== document) {
        if ( selector ) {

            // If selector is a class
            if ( firstChar === '.' ) {
                if ( elem.classList.contains( selector.substr(1) ) ) {
                    parents.push( elem );
                }
            }

            // If selector is an ID
            if ( firstChar === '#' ) {
                if ( elem.id === selector.substr(1) ) {
                    parents.push( elem );
                }
            }

            // If selector is a data attribute
			// <=== Changed this part as well like the last funciton getCloset()
            if ( firstChar === '[' ) {
                if ( elem.hasAttribute( attribute[0] )) {
					if ( value ) {
						if ( elem.getAttribute( attribute[0] ) === attribute[1] ) {
							parents.push( elem );
						}
					} else {
						if ( elem.hasAttribute( selector.substr(0, selector.length - 1) ) ) {
							parents.push( elem );
						}
					}
                }
            }
			
            // If selector is a tag
			console.log("Node type: "+elem.nodeType);
			if (elem.nodeType===1){
				if ( elem.tagName.toLowerCase() === selector ) {
					parents.push( elem );
				}
			}

        } else {
            parents.push( elem );
        }
		
		// <=== Climb up to previous element (sibling)
		previous = elem; // <=== We have to save the previous element or else we wont be able to make the jump to the parent
		elem = elem.previousElementSibling;
		if(elem==null){ elem = previous.parentNode}; // <=== If there are no more siblings go to the parent and keep climbing
		
    }

    // Return parents if any exist
    if ( parents.length === 0 ) {
        return null;
    } else {
        return parents;
    }

};

/**
 * Manage button clicks
 */
function manager(btn,search,handler){
	if (btn!=null&&search!=null&&handler!=null){
		// Determine which funciton we should run
		if(handler=="closest"){
			// Only one item was requested if its found highlight it
			var elem = closest(btn,search);
			if(elem!=null){
				elem.style.backgroundColor = "#F9FF9A";
				setTimeout(clear.bind(null,elem),4000);
			}
		} else if (handler=="getParents"){
			// Multiple items were requested loop through result if one is returned
			var elem = getParents(btn,search);
			if(elem!=null){
				var len = elem.length;
				for (var x=0;x<len;x++){
					elem[x].style.backgroundColor = "#F9FF9A";
					setTimeout(clear.bind(null,elem[x]),4000);
				}
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