const HOST = 'http://localhost:3000/';

window.onload = async () => {
    const response = await fetch(HOST + 'archive/allposts');
    const myJson = await response.json(); 

    var stringjson = JSON.stringify(myJson);
    var values = JSON.parse(stringjson);
    var options = {
        valueNames: ['image', 'text', 'created_date'],
        item: 'archive-item'
    };
    var archiveList = makeList(values)
}

function makeList(array) {
    var list = document.getElementById('archive-list')

    for (var i = array.length-1; i >= 0; i--) {
        // Create the list item:
        var item = document.createElement('li');

        var a = document.createElement('a');
        var text = document.createTextNode( array[i].image + " - " + array[i].created_date.substr(0,10));
        a.appendChild(text);
        a.title = array[i].created_date.substr(0,9);
        a.href = HOST + "post?name=" + array[i].image;
        var li = document.createElement('li');
        li.appendChild(a);
        li.className = 'archive-item';

        // Add it to the list:
        list.appendChild(li);
        var br = document.createElement("br");
        list.appendChild(br);
    }
}