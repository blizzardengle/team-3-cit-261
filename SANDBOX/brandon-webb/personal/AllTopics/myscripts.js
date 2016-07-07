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
        var filename = "objcts.txt";
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
                if(xhttp.readyState == 4 && xhttp.status == 200) {	//file exists
                        createUserList(xhttp.responseText);
                } else { //should be a 404
                        if(xhttp.status != 200 && xhttp.readyState != 1)	//only display if real error occurs
                                document.getElementById("details").innerHTML = "State: " + xhttp.readyState + ", Status: " + xhttp.status;
                }
        }
        xhttp.open("GET", filename, true);
        xhttp.send();
}
	
function createUserList(users) {
        users = JSON.parse(users);	//convert to JSON

        for(var i = 0; i < users.length; i++) {	//loop through the list
                var option = document.createElement("option");
                option.value = users[i];
                var text = document.createTextNode(users[i]);
                option.appendChild(text);
                document.getElementById("users").appendChild(option);
        }
}
	
function getUserData() {
        var user = document.getElementById("users").value;

        var filename = "ajax-json-data.php?action=fetch&name=" + user;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
                if(xhttp.readyState == 4 && xhttp.status == 200) {	//file exists
                        displayUserData(xhttp.responseText);
                } else { //processing
                        document.getElementById("details").innerHTML = "Fetching the data, please wait a second.";
                }
        }
        xhttp.open("GET", filename, true);
        xhttp.send();
}

function displayUserData(data) {
        data = JSON.parse(data);	//convert to JSON
        var orders = "";

        for(var i = 0; i < data.length; i++) {
                orders += "Item Name: " + data[i].Item + "<br/>";
                orders += "Quantity: " + data[i].Quantity + "<br/>";
                orders += "Item Price: " + data[i].Price + "<br/>";
                orders += "Total Price: " + data[i].Total + "<br/>";
                if(data.length-1 != i) orders += "<hr/>";
        }

        if(orders == "") orders = "That user currently has no orders."

        document.getElementById("details").innerHTML = orders;
}

