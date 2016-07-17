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

//This gets teh user list from the server using an AJAX request
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
            
            switch (url) {
                case 'Don.txt':
                var wishes = xhttp.responseText;
                var obj = JSON.parse(wishes);
                document.getElementById("donwants").innerHTML =
                "#1 wish is " + obj.wish1 + "<br>"  +
                "#2 wish is " + obj.wish2 + "<br>"  +
                "#2 wish is " + obj.wish3;
                break;
            }
            switch (url) {
                case 'Tammy.txt':
                var wishes = xhttp.responseText;
                var obj = JSON.parse(wishes);
                document.getElementById("tammywants").innerHTML =
                "#1 wish is " + obj.wish1 + "<br>"  +
                "#2 wish is " + obj.wish2 + "<br>"  +
                "#2 wish is " + obj.wish3;                
                break;
            }
            switch (url) {
                case 'Brandon.txt':
                var wishes = xhttp.responseText;
                var obj = JSON.parse(wishes);
                document.getElementById("brandonwants").innerHTML =
                "#1 wish is " + obj.wish1 + "<br>"  +
                "#2 wish is " + obj.wish2 + "<br>"  +
                "#2 wish is " + obj.wish3;                
                break;
            }
            switch (url) {
                case 'Brenton.txt':
                var wishes = xhttp.responseText;
                var obj = JSON.parse(wishes);
                document.getElementById("brentonwants").innerHTML =
                "#1 wish is " + obj.wish1 + "<br>"  +
                "#2 wish is " + obj.wish2 + "<br>"  +
                "#2 wish is " + obj.wish3;               
                break;
            }
            switch (url) {
                case 'Brittany.txt':
                var wishes = xhttp.responseText;
                var obj = JSON.parse(wishes);
                document.getElementById("brittanywants").innerHTML =
                "#1 wish is " + obj.wish1 + "<br>"  +
                "#2 wish is " + obj.wish2 + "<br>"  +
                "#2 wish is " + obj.wish3;  
                break;
            }
            switch (url) {
                case 'Bryson.txt':
                var wishes = xhttp.responseText;
                var obj = JSON.parse(wishes);
                document.getElementById("brysonwants").innerHTML =
                "#1 wish is " + obj.wish1 + "<br>"  +
                "#2 wish is " + obj.wish2 + "<br>"  +
                "#2 wish is " + obj.wish3;  
                break;
            }
        }
        else { //This is a neat piece of code that remove it when it's not hovered over
            document.getElementById('donwants').innerHTML = "";
            document.getElementById('tammywants').innerHTML = "";
            document.getElementById('brandonwants').innerHTML = "";
            document.getElementById('brentonwants').innerHTML = "";
            document.getElementById('brittanywants').innerHTML = "";
            document.getElementById('brysonwants').innerHTML = "";
        };  
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}

//This function hides the form part of the application
function hideForm() {
    document.getElementById("form").style.display = "none";
}

//This functions display the form part of the application
function showForm() {
    document.getElementById("form").style.display = "inline";
}

//This function creates a new div dynamically and then creates a text area dynamically. This is my bread and butter
function enterinfo(src) {
    this.person = src;
    var newDiv = document.createElement("div");
    newDiv.setAttribute("id","context");
    var newContent = document.createTextNode("Enter Information for " + person + 
                                             ". (You can enter a bunch of things and ideas \n\
                                             this will be save on your local computer)."); 
    
    newDiv.appendChild(newContent); //add the text node to the newly created div. 
    
    // add the newly created element and its content into the DOM 
    var currentDiv = document.getElementById("div1"); 
    document.body.insertBefore(newDiv, currentDiv);
    
    var input = document.createElement("textarea");
    input.type = "text";
    input.className = "css-class-name";
    input.id = src + "ideas";
    input.className = "localideas";
    newDiv.appendChild(input);
    
    var saveButton = document.createElement("BUTTON");  
    saveButton.type = "reset";
    saveButton.id = "button";
    saveButton.setAttribute("onclick","save(src)");
    var text = document.createTextNode("SAVE");
    saveButton.appendChild(text);
    newDiv.appendChild(saveButton);
}

//This function saves what is enter in the textarea and then goes back to the homepage by going to the beginning function
function save(src) { //This function saves the value entered above to local storage
	var fieldValue = document.getElementById(src + "ideas").value;
        if (fieldValue===''||fieldValue===null) {
            alert("Please enter something");
        } else {
	localStorage.setItem(src, fieldValue);
        
        //This piece of code was grabbed from
        //http://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
        var myNode = document.getElementById("context");
            while (myNode.firstChild) {
            myNode.removeChild(myNode.firstChild);
            myNode.remove();
            beginning();
            }
         }
}

//This function loads into the text area whatever is stored in storage
function load(src) { //This function loads whatevers in storage at the value
	var storedValue = localStorage.getItem(src);
	if (storedValue!==null) {
		document.getElementById(src + "ideas").innerHTML = storedValue;
	} else {
            alert("There is nothing in storage!");
        }
}

//This function takes you back to the beginning of the application
function beginning() {
    getUserList(); 
    showApp();
}

        
        
 
        





