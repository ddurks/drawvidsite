var CANVAS_WIDTH = 480;
var CANVAS_HEIGHT = 480;

// create canvas
var canvasElement = $("<canvas width='" + CANVAS_WIDTH + "' height='" + CANVAS_HEIGHT + "'></canvas>");
var canvas = canvasElement.get(0).getContext("2d");

// small-man sprite
const scale = 0.30;
const width = 250;
const height = 275;
const scaledWidth = scale * width;
const scaledHeight = scale * height;
var man_img = new Image();
man_img.src = '/images/small-man-sprite-sheet.png';

const man_loop = [0,1,2,3,4,5,6,7];
let man_loop_i = 0;
let frame = 0;
let direction = 0;
let standing = true;
var posx = 50;
var posy = 50;

function drawFrame(frameX, frameY, canvasX, canvasY) {
    canvas.drawImage(man_img, frameX * width, frameY * height, width, height, canvasX, canvasY, scaledWidth, scaledHeight);
};

function step() {
    frame++;
    var rand = Math.floor((Math.random() * 100));
    
    if (frame < 8) {
        window.requestAnimationFrame(step);
        return;
    }
    frame = 0;
    canvas.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    drawFrame(man_loop[man_loop_i], direction, 200, 200);
    man_loop_i ++;
    if (man_loop_i >= man_loop.length) {
        man_loop_i = 0;
        direction++;
    }

    if(direction >= 4) {
        direction = 0;
    }
    window.requestAnimationFrame(step);
};

function init() {
    window.requestAnimationFrame(step);
};


$(document).ready(function(){
    canvasElement.appendTo( "#canvas-div" );

    man_img.onload = function() {
        init();
    };
/*
    // configure game loop
    var FPS = 30;
    setInterval(function() {
        update();
        draw();
    }, 1000/FPS);
    */
});
