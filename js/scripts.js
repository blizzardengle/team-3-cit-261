function loadLinks(){
	ajax("cache/sandboxLinks.html","sandboxLinks");
}
loadLinks();

function loadSandbox(elem,page){
	event.preventDefault();
	document.getElementById("breadcrumbs").innerHTML = "";
	document.getElementById("output").innerHTML = "";
	var navigation = '<div id="breadcrumbs"><img src="home-logo.png" alt="Home Page"> &nbsp;&nbsp;&nbsp;>&nbsp;&nbsp;&nbsp; Sandbox &nbsp;&nbsp;&nbsp;>&nbsp;&nbsp;&nbsp; '+page.replace("-"," ")+'</div><br><img src="loading.gif" alt="Loading">';
	document.getElementById("output").innerHTML = navigation;
	setTimeout(function () {
		document.getElementById("breadcrumbs").innerHTML = '<div class="breadcrumbs"><a href="index.html"><img src="home-logo.png" alt="Home Page"></a> &nbsp;&nbsp;&nbsp;>&nbsp;&nbsp;&nbsp; Sandbox &nbsp;&nbsp;&nbsp;>&nbsp;&nbsp;&nbsp; '+page.replace("-"," ")+'</div>';
        ajax("cache/"+page+".html","output",true);
    },800);
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