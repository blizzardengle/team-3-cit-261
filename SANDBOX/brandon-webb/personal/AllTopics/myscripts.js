//Author Brandon Webb

//This is a reminder application that reminds you about all your friends

//Local Storage - This function checks browser of localstorage
function checkStorage() {
    if (typeof(Storage) !== "undefined") {
    document.getElementById("storage_status").innerHTML = "";
    } else {
    document.getElementById("storage_status").innerHTML = "This application won't work on your device";
    }
}

function getUserList() {
        var filename = "objects.txt";
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if(xhttp.readyState === 4 && xhttp.status === 200) {	//file exists
                    createUserList(xhttp.responseText);
            } else { //should be a 404
                    if(xhttp.status !== 200 && xhttp.readyState !== 1)	//only display if real error occurs
                            document.getElementById("details").innerHTML = "State: " + xhttp.readyState + ", Status: " + xhttp.status;
            }
        };
        xhttp.open("GET", filename, true);
        xhttp.send();
}
	
function createUserList(users) {
        var list = JSON.parse(users);
        
        
        /*for(var i = 0; i < list.length; i++) {	//loop through the list
            var option = document.createElement("option");
            option.value = users[i];
            var text = document.createTextNode(users[i]);
            option.appendChild(text);
            document.getElementById("users").appendChild(option);
        }*/
}

//This function hides the application part when intially starting application
function hideApp() {
    	document.getElementById("appspace").style.display = "none";

}

//This function starts the app and gets ride of the start button
function showApp() {
    document.getElementById("appspace").style.display = "inline";
    document.getElementById("start").style.display = "none";
    hidewants();
    
    //This hides all off the wants of the user
    function hidewants() {
        var elements = document.getElementsByClassName("wants");
        for (i = 0; i < elements.length; i++) {
            elements[i].style.display='none';   
        }
    }
}

//Shows the information about the users and what they want and what they are going to get.
function showinfo(src) {
    this.src = src;
    switch (src) {
        case 'Don':
            document.getElementById("donwants").style.display = "inline";
            var url = src + ".txt";
            getWishList(url);
        break;
        
        case 'Tammy':
            document.getElementById("tammywants").style.display = "inline";
            var url = src + ".txt";
            getWishList(url);
        break;
        
        case 'Brandon':
            document.getElementById("brandonwants").style.display = "inline";
            var url = src + ".txt";
            getWishList(url);
        break;
        
        case 'Brenton':
            document.getElementById("brentonwants").style.display = "inline";
            var url = src + ".txt";
            getWishList(url);
        break;
        
        case 'Brittany':
            document.getElementById("brittanywants").style.display = "inline";
            var url = src + ".txt";
            getWishList(url);
        break;
        
        case 'Bryson':
            document.getElementById("brysonwants").style.display = "inline";
            var url = src + ".txt";
            getWishList(url);
        break;
    }
} 

//Does a AJAX request to get what the user stored on the web
function getWishList(url) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            
            //This is the code to make JSON 
            //var response = mkobj(responseText);
     
            document.getElementById('donwants').innerHTML = xhttp.responseText;  
        }
        else {
            document.getElementById('donwants').innerHTML = "Can't Access Site";
        };  
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}

//This function hides the input form
function hideForm() {
    
}

function enterinfo(src) {
    this.person = src;
    alert(src);
    var newDiv = document.createElement("div"); 
    var newContent = document.createTextNode("Enter Information for " + src); 
    newDiv.appendChild(newContent); //add the text node to the newly created div. 

    // add the newly created element and its content into the DOM 
    var currentDiv = document.getElementById("div1"); 
    document.body.insertBefore(newDiv, currentDiv);
    
}


        
        
 
        





//This code that I'm going to make
/*
 
//The following code stores the elements in the html into variables
var xx = document.getElementById("team"); 
var button1 = document.getElementById("b1"); 
var button2 = document.getElementById("b2");

//The following code lets us listen to the buttons and add a listener
document.getElementById("b2").addEventListener("click", f1, false);
document.getElementById("b1").addEventListener("click", f2 , false);

//These are the functions mention in the above code
function f1() {document.getElementById("team").innerHTML="Go Cougars!";};
function f2() {document.getElementById("team").innerHTML="Go Utes!";};

//This is hardcoded function that you don't have to create a separate function
button1.addEventListener("click", function () {xx.style.color="red";} , false);
button2.addEventListener("click", function () {xx.style.color="blue";} , false);
</script>
*/
