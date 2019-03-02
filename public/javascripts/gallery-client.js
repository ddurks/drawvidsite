var CANVAS_HEIGHT = 500;
var CANVAS_WIDTH = 500;
var canvas = null;
window.onload = async () => {
    canvas = document.createElement('canvas');
    canvas.setAttribute('id','gallery-canvas');
    canvas.setAttribute('width',CANVAS_WIDTH);
    canvas.setAttribute('height',CANVAS_HEIGHT);
    document.getElementById('gallery-div').appendChild(canvas);

    const response = fetch('archive/allposts')
    .then(response => response.json())
    .then(postlist => {
        //console.log(postlist);
        loadImages(postlist);
    })
    .catch(error => console.error(error));
}

function loadImages(posts) {
    const response = fetch('generate-gallery')
    .then(response => response.json())
    .then(images => {
        var ctx = canvas.getContext('2d');
        images.forEach(element => {
            var image = new Image();
            image.onload = function () {
                //console.log(element.image);
                var canvas_x = Math.floor((Math.random() * CANVAS_HEIGHT)) - 40;
                var canvas_y = Math.floor((Math.random() * CANVAS_WIDTH)) - 40;
                ctx.drawImage(this, canvas_x, canvas_y);
            }
            image.src = element.image;
        });
    })
    .catch(error => console.error(error));
}