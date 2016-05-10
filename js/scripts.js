function loadLinks(){
	// Little pause to show user the links are loading
	setTimeout(function () {
       ajax("cache/sandboxLinks.html","sandboxLinks");
       ajax("cache/portfolioLinks.html","portfolioLinks");
    },500);
}
loadLinks();

function loadSandbox(elem,page){
	event.preventDefault();
	// Clear old information
	document.getElementById("breadcrumbs").innerHTML = "";
	document.getElementById("output").innerHTML = "";
	// Show new navigation and load sandbox
	document.getElementById("breadcrumbs").innerHTML = '<a href="index.html"><img src="home-logo.png" alt="Home Page" title="Go to home page."></a> &nbsp;&nbsp;&nbsp;>&nbsp;&nbsp;&nbsp; Sandbox &nbsp;&nbsp;&nbsp;>&nbsp;&nbsp;&nbsp; '+page.replace("-"," ")+'</div>';
	document.getElementById("output").innerHTML = '<br><img src="loading.gif" alt="Loading">';
	// Little pause to show user the page is loading
	setTimeout(function () {
        ajax("cache/s-"+page+".html","output",true);
    },500);
}

function ajax(page,id){	
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
		document.getElementById(id).innerHTML = ajaxCon.responseText;
	}
	
	/**
	 * Initiate an ajax connection
	 */
	ajaxCon.open("get",page); //	<=== This whole part could be changed or added to
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