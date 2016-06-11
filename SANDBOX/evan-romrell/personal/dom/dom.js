function editRow(row) {
    var ul = document.getElementById(row);
    
    //Gather Employee information 
    var name = ul.childNodes[3].childNodes[0].nodeValue;
    var title = ul.childNodes[5].childNodes[0].nodeValue;
    var salary = ul.childNodes[7].childNodes[0].nodeValue;
    
    
    //Create Inputs
    var input1 = document.createElement('input');
    var input2 = document.createElement('input');
    var input3 = document.createElement('input');

    var update = 'update(' + row + ')';
    var cancel = 'changeToText(' + row + ', "' + name + '", "' + title + '", "' + salary + '")';
    
    
    //Replace Employee info with inputs
    replaceInfo(3, 'name', name, input1, ul);
    replaceInfo(5, 'title', title, input2, ul);
    replaceInfo(7, 'salary', salary, input3, ul);
    
    ul.childNodes[9].childNodes[0].setAttribute('onclick', update);
    ul.childNodes[9].childNodes[0].setAttribute('value', 'update');
    ul.childNodes[11].childNodes[0].setAttribute('onclick', cancel);
    ul.childNodes[11].childNodes[0].setAttribute('value', 'cancel');
}

function replaceInfo(child, type, value, input, ul) {
    ul.childNodes[child].replaceChild(input, ul.childNodes[child].childNodes[0]);
    ul.childNodes[child].childNodes[0].setAttribute('type', 'text');
    ul.childNodes[child].childNodes[0].setAttribute('id', type);
    ul.childNodes[child].childNodes[0].setAttribute('value', value);
}

function update(row) {
    var name = document.getElementById('name').value;
    var title = document.getElementById('title').value;
    var salary = document.getElementById('salary').value;
    
   changeToText(row, name, title, salary);
}


function changeToText(row, name, title, salary){
    var ul = document.getElementById(row);
    
    text1 = document.createTextNode(name);
    text2 = document.createTextNode(title);
    text3 = document.createTextNode(salary);
    
    ul.childNodes[3].replaceChild(text1, ul.childNodes[3].childNodes[0]);
    ul.childNodes[5].replaceChild(text2, ul.childNodes[5].childNodes[0]);
    ul.childNodes[7].replaceChild(text3, ul.childNodes[7].childNodes[0]);
    
    var edit = 'editRow(' + row + ')';
    var del = 'deleteRow(' + row + ')';
    
    ul.childNodes[9].childNodes[0].setAttribute('onclick', edit);
    ul.childNodes[9].childNodes[0].setAttribute('value', 'Edit');
    ul.childNodes[11].childNodes[0].setAttribute('onclick', del);
    ul.childNodes[11].childNodes[0].setAttribute('value', 'Delete');
}

function deleteRow(row) {
    var ul = document.getElementById(row);
    while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
    }
    ul.parentNode.removeChild(ul);
}

function newRow() {
    var row = insertRow('name', 'title', 'salary');
    editRow(row);
    var ul = document.getElementById(row);
    ul.childNodes[9].childNodes[0].setAttribute('value', 'Save');
    var del = 'deleteRow(' + row + ')';
    ul.childNodes[11].childNodes[0].setAttribute('onclick', del);
}

function insertRow(name, title, salary) {
    var table = document.getElementById('employees');
    var blank1 = document.createTextNode(' ');
    table.childNodes[1].appendChild(blank1);
    var count = 0;
    for(var i=0; i < table.childNodes[1].childNodes.length; i++){
        if(table.childNodes[1].childNodes[i].nodeType == 1) count++;
    }
    var tr = document.createElement('tr');
    table.childNodes[1].appendChild(tr);
    table.childNodes[1].lastChild.setAttribute('id', count);
    var  ul = document.getElementById(count);
    var td;
    var blank;
    for (i=0; i < 6; i++) {
        blank = document.createTextNode(' ');
        ul.appendChild(blank);
        td = document.createElement('td');
        ul.appendChild(td);
    }
    var id = document.createTextNode(count);
    var tname = document.createTextNode(name);
    var ttitle = document.createTextNode(title);
    var tsalary = document.createTextNode(salary);
    var eedit = document.createElement('input');
    var edelete = document.createElement('input');
    
    ul.childNodes[1].appendChild(id);
    ul.childNodes[3].appendChild(tname);
    ul.childNodes[5].appendChild(ttitle);
    ul.childNodes[7].appendChild(tsalary);
    ul.childNodes[9].appendChild(eedit);
    ul.childNodes[11].appendChild(edelete);
    var edit = 'editRow(' + count + ')';
    var del = 'deleteRow(' + count + ')';
    ul.childNodes[9].childNodes[0].setAttribute('onclick', edit);
    ul.childNodes[9].childNodes[0].setAttribute('value', 'Edit');
    ul.childNodes[9].childNodes[0].setAttribute('type', 'button');
    ul.childNodes[11].childNodes[0].setAttribute('onclick', del);
    ul.childNodes[11].childNodes[0].setAttribute('value', 'Delete');
    ul.childNodes[11].childNodes[0].setAttribute('type', 'button');
    return count;
}

function flip(side) {
    var card = document.getElementById('card');
    var currentc = 'flip("' + card.getAttribute('class') + '")';
   
    card.setAttribute('onclick', currentc);
    if (side == 'back') {
        var text = document.createTextNode('Helena');
    } else {
        var text = document.createTextNode('What is the capitol of Montana?');
    }
    card.setAttribute('class', side); 
   setTimeout(function(){ card.childNodes[1].replaceChild(text, card.childNodes[1].childNodes[0]); if (side == 'back') { card.childNodes[1].setAttribute('class', side);} else card.childNodes[1].setAttribute('class', ''); }, 250);
      
      
}


//function var change = 'change("' + text + '")';
 //   card.setAttribute('onload', change)

function delay(time) {
  var d1 = new Date();
  var d2 = new Date();
  while (d2.valueOf() < d1.valueOf() + time) {
    d2 = new Date();
  }
}

