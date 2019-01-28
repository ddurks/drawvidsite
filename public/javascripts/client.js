const HOST = 'http://drawvid-express-env.sdv2pjgjzk.us-east-2.elasticbeanstalk.com:3000/';
var current_post_number;
var r_p;
window.onload = async () => {
    const response = await fetch(HOST + 'current_post');
    const myJson = await response.json(); 

    var stringjson = JSON.stringify(myJson);
    var obj = JSON.parse(stringjson);
    current_post_number = obj.current_num;
    r_p = current_post_number;
}
const queryRandom = async () => {
    const response = await fetch(HOST + 'random');
    const myJson = await response.json(); 

    var stringjson = JSON.stringify(myJson);
    var obj = JSON.parse(stringjson);
    document.getElementById('main-display').src=obj.link;
    document.getElementById('random').href=obj.link;
    current_post_number = obj.num
}
function randomDrawing() {
    queryRandom();
}
const queryPrev = async () => {
    const response = await fetch(HOST + 'prev?curr=' + current_post_number);
    const myJson = await response.json(); 

    var stringjson = JSON.stringify(myJson);
    var obj = JSON.parse(stringjson);
    document.getElementById('main-display').src=obj.link;
    current_post_number = obj.num
}
function prevDrawing() {
    if(current_post_number > 0) {
        queryPrev();
    }
}
const queryNext = async () => {
    const response = await fetch(HOST + 'next?curr=' + current_post_number);
    const myJson = await response.json(); 

    var stringjson = JSON.stringify(myJson);
    var obj = JSON.parse(stringjson);
    document.getElementById('main-display').src=obj.link;
    current_post_number = obj.num
}
function nextDrawing() {
    if(current_post_number < r_p) {
        queryNext();
    }
}