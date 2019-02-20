var current_post_number;

var r_p;
var current_drawing;

window.onload = async () => {
    const response = fetch('most_recent_post')
    .then(response => response.json())
    .then(data => {
        current_drawing = {
          id: data.current_num,
          text: data.text,
          image: 'https://s3.amazonaws.com/drawvid-posts/' + data.image,
          link: data.link,
          created_date: data.date
        }
        console.log(current_drawing);
        r_p = data.current_num;
        const response = fetch('post?name=' + cookie.curr)
        .then(response => response.json())
        .then(data => {
            current_drawing = {
                id: data.id,
                text: data.text,
                image: 'https://s3.amazonaws.com/drawvid-posts/' + data.image,
                link: data.link,
                created_date: data.date
            }
            console.log(current_drawing);
            document.getElementById('main-display').src = current_drawing.image;
        })
        .catch(error => console.error(error));
    })
    .catch(error => console.error(error));
}

// GET random post from DB
const queryRandom = async () => {
    const response = fetch('random')
    .then(response => response.json())
    .then(data => {
        current_drawing = {
          id: data.id,
          text: data.text,
          image: 'https://s3.amazonaws.com/drawvid-posts/' + data.image,
          link: data.link,
          created_date: data.date
        }
        console.log(current_drawing);
        document.getElementById('main-display').src = current_drawing.image;
    })
    .catch(error => console.error(error));
}
function randomDrawing() {
    queryRandom();
}

// GET prev post from db
const queryPrev = async () => {
    const response = fetch('prev?curr=' + current_drawing.id)
    .then(response => response.json())
    .then(data => {
        current_drawing = {
          id: data.id,
          text: data.text,
          image: 'https://s3.amazonaws.com/drawvid-posts/' + data.image,
          link: data.link,
          created_date: data.date
        }
        console.log(current_drawing);
        document.getElementById('main-display').src = current_drawing.image;
    })
    .catch(error => console.error(error));
}
function prevDrawing() {
    if(current_drawing.id > 0) {
        queryPrev();
    }
}

// GET next post from db
const queryNext = async () => {
    const response = fetch('next?curr=' + current_drawing.id)
    .then(response => response.json())
    .then(data => {
        current_drawing = {
          id: data.id,
          text: data.text,
          image: 'https://s3.amazonaws.com/drawvid-posts/' + data.image,
          link: data.link,
          created_date: data.date
        }
        console.log(current_drawing);
        document.getElementById('main-display').src = current_drawing.image;
    })
    .catch(error => console.error(error));
}
function nextDrawing() {
    if(current_drawing.id < r_p) {
        queryNext();
    }
}