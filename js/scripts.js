function loadSandbox(elem,page){
	event.preventDefault();
	ajaxSendForm(page,"output");
	return true;
}

/**
 * Ajax connection specificly for sending a HTML form
 * EXAMPLES BUT NOT COPIES: http://stackoverflow.com/questions/8567114/how-to-make-an-ajax-call-without-jquery
 * THE MANUAL YOU SHOULD READ: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
 * @param {Node} elem the HTML element that was pressed to call this function
 * @param {id} id the HTML element id that any response or data will be sent to		<=== This could be changed or added to
 * @returns {Boolean} true on success and false on failure
 */
function ajaxSendForm(page,id){	
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
					document.getElementById(id).innerHTML = ajaxCon.responseText;	//	<=== This could be changed or added to
					return true;
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
	ajaxCon.open("post","cache/"+page+".html"); //	<=== This whole part could be changed or added to
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