var subMenus = null;
var openedSubMenu = null;

function recordSubMenus(){
	subMenus = find("[data-submenu]");
	var parents = find("[data-submenu-parent]");
	var len = parents.length;
	for (var x=0;x<len;x++){
		parents[x].onclick = openSubMenu.bind(null,parents[x]);
	}
	var closeIcon = null;
	var len = subMenus.length;
	for (var x=0;x<len;x++){
		closeIcon = find(".close",subMenus[x])[0];
		closeIcon.onclick = closeSubMenu.bind(null,subMenus[x]);
	}
}

function openSubMenu(elem){
	if(openedSubMenu!=null){
		var id = openedSubMenu.dataset.submenu;
		var parents = find("[data-submenu-parent]");
		var len = parents.length;
		for (var x=0;x<len;x++){
			if(parents[x].dataset.submenuParent===id){
				parents[x].parentNode.className = parents[x].parentNode.className.replace(" opened","");
			}
		}
	}
	elem.parentNode.className += elem.parentNode.className + " opened";
	var id = elem.dataset.submenuParent;
	var len = subMenus.length;
	var dim = viewport();
	var extra = null;
	for (var x=0;x<len;x++){
		if(subMenus[x].dataset.submenu===id){
			if (openedSubMenu!=null){
				openedSubMenu.style.display = "none";
			}
			openedSubMenu = subMenus[x];
			extra = window.getComputedStyle(openedSubMenu,null);
			extra = parseInt(extra.getPropertyValue('padding-top').replace(/\D+/g,'')) + parseInt(extra.getPropertyValue('padding-bottom').replace(/\D+/g,''));
			subMenus[x].style.height = (dim.height - extra) + "px";
			subMenus[x].style.display = "block";
		}
	}
	/**
	 * Stop link from actually firing
	 */
	return false;
}

function closeSubMenu(elem){
	if (openedSubMenu!=null){
		openedSubMenu.style.display = "none";
		var id = openedSubMenu.dataset.submenu;
		var parents = find("[data-submenu-parent]");
		var len = parents.length;
		for (var x=0;x<len;x++){
			if(parents[x].dataset.submenuParent===id){
				parents[x].parentNode.className = parents[x].parentNode.className.replace(" opened","");
			}
		}
	}
}

function navigate(page,result){
	if (result==null){
		page = "pages/"+page.toLowerCase();
		ajaxLoad(page,navigate);
	} else {
		document.getElementById("displayArea").innerHTML = result;
	}
}

function setupResizeWatch(){
	document.body.onresize = resizeWatch;
}

function resizeWatch(){
	var dim = viewport();
	var extra = null;
	if(openedSubMenu!=null){
		extra = window.getComputedStyle(openedSubMenu,null);
		extra = parseInt(extra.getPropertyValue('padding-top').replace(/\D+/g,'')) + parseInt(extra.getPropertyValue('padding-bottom').replace(/\D+/g,''));
		openedSubMenu.style.height = (dim.height - extra) + "px";
	}
}

function ajaxLoad(url,callback){
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
			 * Process the result according to the status code
			 */
			switch(ajaxCon.status){
				case 100:
				case 101:
				case 103:
					// Run this generic code for all 100 codes
					break;
				case 200:
				case 201:
				case 202:
				case 203:
				case 204:
				case 205:
				case 206:
					// Run this generic code for all 200 codes
					callback(url,ajaxCon.responseText);	//	<=== This could be changed or added to
					break;
				case 300:
				case 301:
				case 302:
				case 303:
				case 304:
				case 306:
				case 307:
				case 308:
					// Run this generic code for all 300 codes
				case 400:
				case 401:
				case 402:
				case 403:
				case 404:
				case 405:
				case 406:
				case 407:
				case 408:
				case 409:
				case 410:
				case 411:
				case 412:
				case 413:
				case 414:
				case 415:
				case 416:
				case 417:
					// Run this generic code for all 400 codes
					break;
				case 500:
				case 501:
				case 502:
				case 503:
				case 504:
				case 505:
				case 511:
					// Run this generic code for all 500 codes
					break;
				default:
					// Run this generic code for all other codes
					break;
			}
		}
	}
	
	/**
	 * Initiate an ajax connection
	 */
	if (url.indexOf("?")>0){
		url += "&timestamp=";
	} else {
		url += "?timestamp=";
	}
	url += ""+(Math.floor(Date.now() / 1000));
	ajaxCon.open("GET",url);
	ajaxCon.send("");
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

function viewport(){
	var viewportwidth;
	var viewportheight;

	// the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight

	if (typeof window.innerWidth != 'undefined')
	{
	viewportwidth = window.innerWidth,
	viewportheight = window.innerHeight
	}

	// IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)

	else if (typeof document.documentElement != 'undefined'
	&& typeof document.documentElement.clientWidth !=
	'undefined' && document.documentElement.clientWidth != 0)
	{
	viewportwidth = document.documentElement.clientWidth,
	viewportheight = document.documentElement.clientHeight
	}

	// older versions of IE

	else
	{
	viewportwidth = document.getElementsByTagName('body')[0].clientWidth,
	viewportheight = document.getElementsByTagName('body')[0].clientHeight
	}
	
	return {width:viewportwidth,height:viewportheight};
}
/**
 * https://github.com/jfriend00/docReady
 * @param {type} funcName
 * @param {type} baseObj
 * @returns {undefined}
 */
(function(funcName, baseObj) {
    "use strict";
    // The public function name defaults to window.docReady
    // but you can modify the last line of this function to pass in a different object or method name
    // if you want to put them in a different namespace and those will be used instead of 
    // window.docReady(...)
    funcName = funcName || "docReady";
    baseObj = baseObj || window;
    var readyList = [];
    var readyFired = false;
    var readyEventHandlersInstalled = false;
    
    // call this when the document is ready
    // this function protects itself against being called more than once
    function ready() {
        if (!readyFired) {
            // this must be set to true before we start calling callbacks
            readyFired = true;
            for (var i = 0; i < readyList.length; i++) {
                // if a callback here happens to add new ready handlers,
                // the docReady() function will see that it already fired
                // and will schedule the callback to run right after
                // this event loop finishes so all handlers will still execute
                // in order and no new ones will be added to the readyList
                // while we are processing the list
                readyList[i].fn.call(window, readyList[i].ctx);
            }
            // allow any closures held by these functions to free
            readyList = [];
        }
    }
    
    function readyStateChange() {
        if ( document.readyState === "complete" ) {
            ready();
        }
    }
    
    // This is the one public interface
    // docReady(fn, context);
    // the context argument is optional - if present, it will be passed
    // as an argument to the callback
    baseObj[funcName] = function(callback, context) {
        // if ready has already fired, then just schedule the callback
        // to fire asynchronously, but right away
        if (readyFired) {
            setTimeout(function() {callback(context);}, 1);
            return;
        } else {
            // add the function and context to the list
            readyList.push({fn: callback, ctx: context});
        }
        // if document already ready to go, schedule the ready function to run
        // IE only safe when readyState is "complete", others safe when readyState is "interactive"
        if (document.readyState === "complete" || (!document.attachEvent && document.readyState === "interactive")) {
            setTimeout(ready, 1);
        } else if (!readyEventHandlersInstalled) {
            // otherwise if we don't have event handlers installed, install them
            if (document.addEventListener) {
                // first choice is DOMContentLoaded event
                document.addEventListener("DOMContentLoaded", ready, false);
                // backup is window load event
                window.addEventListener("load", ready, false);
            } else {
                // must be IE
                document.attachEvent("onreadystatechange", readyStateChange);
                window.attachEvent("onload", ready);
            }
            readyEventHandlersInstalled = true;
        }
    }
})("docReady", window);
docReady(recordSubMenus);
docReady(setupResizeWatch);