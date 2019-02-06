var CANVAS_WIDTH = 300;
var CANVAS_HEIGHT = 300;
var PACE_DURATION_MAX = 3;

// shim for datetime browser compatibility
if (!Date.now) {
    Date.now = function() { return new Date().getTime(); }
}

// create canvas
var canvasElement = $("<canvas width='" + CANVAS_WIDTH + "' height='" + CANVAS_HEIGHT + "'></canvas>");
var canvas = canvasElement.get(0).getContext("2d");

// small-man sprite constants
const scale = 0.25;
const width = 250;
const height = 275;
const scaledWidth = scale * width;
const scaledHeight = scale * height;
var man_img = new Image();
man_img.src = '/images/small-man-sprite-sheet.png';

//  animation frame
let frame = 0;
let pace_starttime = 0;
let pace_duration = 100;

// class for small-man sprite
var Man = {
    posx: 0,
    posy: 0,
    direction: 0,
    curr_sprite_frame: 0,
    speed: 5,

    create: function(posx, posy) {
        var man = Object.create(this);
        man.loop = [0,1,2,3,4,5,6,7];
        man.loop_i = 0;
        man.posx = posx;
        man.posy = posy;
        man.direction = 0;
        man.speed = 25;
        return man;
    },

    move: function() {
        console.log(this.posx, this.posy);
        if (this.direction == 0) {
            if (this.posy > CANVAS_HEIGHT - scaledHeight ) { 
                this.posy = this.posy--;
                this.direction = 2;
            } else {
                this.posy = this.posy + this.speed;
            }
        }
        if (this.direction == 1) {
            if(this.posx > CANVAS_WIDTH - scaledWidth) {
                this.posx = this.posx--;
                this.direction = 3;
            } else {
                this.posx = this.posx + this.speed;
            }
        }
        if (this.direction == 2) {
            if (this.posy < 0) {
                this.posy = this.posy++;
                this.direction = 0;
            } else {
                this.posy = this.posy - this.speed;
            }
        }
        if (this.direction == 3) {
            if (this.posx < 0 ) {
                this.posx = this.posx++;
                this.direction = 1;
            } else {
                this.posx = this.posx - this.speed;
            }
        }

        if (this.loop_i < 7) {
            this.loop_i++;
        } else {
            this.loop_i = 0;
        }
    }
};

var manObject = Man.create(50, 50);

function getTimestampSeconds() {
    return Math.floor(Date.now() / 1000);
}

function drawFrame(frameX, frameY, canvasX, canvasY) {
    canvas.drawImage(man_img, frameX * width, frameY * height, width, height, canvasX, canvasY, scaledWidth, scaledHeight);
};

function step(timestamp) {
    frame++;
    
    if (frame < 8) {
        window.requestAnimationFrame(function(timestamp) {
            step(timestamp);
        });
        return;
    }
    if ( (getTimestampSeconds() - pace_starttime) > pace_duration ) {
        pace_starttime = getTimestampSeconds();
        pace_duration = Math.floor((Math.random() * PACE_DURATION_MAX));
        manObject.direction = Math.floor((Math.random() * 4))
    }

    frame = 0;
    manObject.move();
    canvas.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    canvas.fillStyle = "gray";
    drawFrame(manObject.loop[manObject.loop_i], manObject.direction, manObject.posx, manObject.posy);

    window.requestAnimationFrame(function(timestamp) {
        step(timestamp);
    });
};

let timestamp = getTimestampSeconds();

function init() {
    timestamp = getTimestampSeconds();
    pace_starttime = getTimestampSeconds();
    pace_duration = Math.floor((Math.random() * PACE_DURATION_MAX));
    window.requestAnimationFrame(function(timestamp) {
        step(timestamp);
    });
};


$(document).ready(function(){
    canvasElement.appendTo( "#canvas-div" );

        man_img.onload = function() {
            init();
        };
});
