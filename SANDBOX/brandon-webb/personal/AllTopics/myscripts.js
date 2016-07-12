//Author Brandon Webb

//Local Storage - This function checks browser of localstorage
function checkStorage() {
    if (typeof(Storage) !== "undefined") {
    document.getElementById("storage_status").innerHTML = "Storage is working";
    } else {
    //Sorry! No Web Storage support..
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
        document.getElementById('users').innerHTML=list.member1name;
        
        /*for(var i = 0; i < list.length; i++) {	//loop through the list
            var option = document.createElement("option");
            option.value = users[i];
            var text = document.createTextNode(users[i]);
            option.appendChild(text);
            document.getElementById("users").appendChild(option);
        }*/
}




function showinfo() {
    document.getElementById("users").innerHTML = "Hello";
} 
function hideinfo() {
    document.getElementById("users").innerHTML = "";
}
