function createFlashCards() {
    document.getElementById('content').innerHTML = "";

    var current = choosenTopic.head; // This grabs the head value of your flashCardSet list which is a flashCards object (link)
    var html = "<div id='cards'>";
    var i = 1;
    var next = 0;
	while(current!==null){
            // creates each card
            html += "<div id='" + i + "' class='invisible' onclick='flip(\"back\", \"" + current.definition + "\")'>";
            html += "<p class='frontText'>" + current.term + "</p>";
            html += "<p class='invisibleText'>" + current.definition + "</p></div>"
            i++;
            current = current.next; // Make sure to move on to the next record or you'll create an infinite loop
	}
    html += "<input type='button' id='back' value='back' onclick='back(null)'><input type='button' id='next' value='next' onclick='next(2)'></div>";
    document.getElementById('content').innerHTML = html;
    slideIn(1);
    
}

function slideIn(id) {
    var card = document.getElementById(id);// this grabs the desired card
    card.setAttribute("class", "front"); // this changes the card from invisible to show front
    
}

function slideOut(id) {
    var card = document.getElementById(id);// this grabs the desired card
    card.setAttribute("class", "invisible"); // this changes the card from invisible to show front
    
}

function back(i) {
    var nextCard = document.getElementById(i);
    if (nextCard == null) {
        return;
    } else {
        var currentId = i + 1;
        slideOut(currentId);
        slideIn(i);
        var backId = i - 1;
        var replacmentForBackButton = "back(" + backId + ")";
        var backButton = document.getElementById('back');
        backButton.setAttribute("onclick", replacmentForBackButton);
        var replacmentForNextButton = "next(" + currentId + ")";
        var nextButton = document.getElementById('next');
        nextButton.setAttribute("onclick", replacmentForNextButton);
    }
}

function next(i) {
    var nextCard = document.getElementById(i);
    if (nextCard == null) {
        return;
    } else {
        var currentId = i - 1;
        slideOut(currentId);
        slideIn(i);
        var nextId = i + 1;
        var replacmentForNextButton = "next(" + nextId + ")";
        var nextButton = document.getElementById('next');
        nextButton.setAttribute("onclick", replacmentForNextButton);
        var replacmentForBackButton = "back(" + currentId + ")";
        var backButton = document.getElementById('back');
        backButton.setAttribute("onclick", replacmentForBackButton);
    }
}

function flip(side, textInput) {
    var card = null;
    var done = false;
    for (var i = 1; done == false; i++) {
        card =  document.getElementById(i);
        var classType = card.getAttribute('class');
        if (classType != "invisible") {
            done = true;
        }
    }
    var currentText = card.childNodes[0].childNodes[0].nodeValue;
    var currentc = 'flip("' + card.getAttribute('class') + '", "' + currentText + '")';
    card.setAttribute('onclick', currentc);
    var text = document.createTextNode(textInput);
    card.setAttribute('class', side); 
   setTimeout(function(){ card.childNodes[0].replaceChild(text, card.childNodes[0].childNodes[0]); if (side == 'back') { card.childNodes[0].setAttribute('class', side);} else card.childNodes[0].setAttribute('class', ''); }, 250);
      
      
}
