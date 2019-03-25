var current_post_number;

var r_p;
var current_drawing;

function postObjectFromJSON(data) {
    var _drawing = {
        id: data.id,
        text: data.text,
        image: 'https://s3.amazonaws.com/drawvid-posts/' + data.image,
        imagename: data.image,
        link: data.link,
        created_date: data.date
    }
    return _drawing;
}

function updatePage(current_drawing) {
    document.getElementById('main-display').src = current_drawing.image;
    if (current_drawing.text != null) {
        document.getElementById('drawing-text').innerHTML = current_drawing.text;
    } else {
        document.getElementById('drawing-text').innerHTML = current_drawing.imagename;
    }
    var c_d = new Date(current_drawing.created_date);
    document.getElementById('drawing-date').innerHTML = c_d.toLocaleString('en-us', { month: 'long' }) + ' ' + c_d.getUTCDay() + ', ' + c_d.getUTCFullYear();
}

window.onload = async () => {
    const response = fetch('most_recent_post')
    .then(response => response.json())
    .then(data => {
        current_drawing = postObjectFromJSON(data);
        //console.log(current_drawing);
        r_p = current_drawing.id;
        updatePage(current_drawing);
    })
    .catch(error => console.error(error));
}

// GET random post from DB
function randomDrawing() {
    const response = fetch('random')
    .then(response => response.json())
    .then(data => {
        current_drawing = postObjectFromJSON(data);
        //console.log(current_drawing);
        updatePage(current_drawing);
    })
    .catch(error => console.error(error));
}

// GET prev post from db
function prevDrawing() {
    //console.log(current_drawing.id);
    if(current_drawing.id > 0) {
        const response = fetch('prev?curr=' + current_drawing.id)
        .then(response => response.json())
        .then(data => {
            current_drawing = postObjectFromJSON(data);
            //console.log(current_drawing);
            updatePage(current_drawing);
        })
        .catch(error => console.error(error));
    }
}

// GET next post from db
function nextDrawing() {
    //console.log(current_drawing.id);
    if(current_drawing.id < r_p) {
        const response = fetch('next?curr=' + current_drawing.id)
        .then(response => response.json())
        .then(data => {
            current_drawing = postObjectFromJSON(data);
            //console.log(current_drawing);
            updatePage(current_drawing);
        })
        .catch(error => console.error(error));
    }
}