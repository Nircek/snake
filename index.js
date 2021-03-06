'use strict';
var WIDTH   = 10;   // width of board (in squares)
var HEIGHT  = 10;   // height of board (in squares)
var SQ      = 50;   // size of square (in pixels)
var APPLEM  = SQ/6; // appple margin
var PADD    = 5;    // padding of square
var MARG    = 10;   // "margin" of canvas
var MARL    = 2;    // margin line ("border")
var canvas;
var ctx;
var direction;
var snakePos;
var apple;
var body;
var range;
var ld;             // last delta of direction
var inter;

function init() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    body = document.getElementById('body');
    body.onkeydown = function(e) {
        if(e.key.substr(0,5)=='Arrow')
            direction = e.key.substr(5,5);
        switch(e.key){
            case ',':--range.value;range.oninput();break;
            case '.':++range.value;range.oninput();break;
        }
    };
    canvas.width = WIDTH*SQ+2*MARG;
    canvas.height = HEIGHT*SQ+2*MARG;
    range = document.getElementById('range');
    range.max = 5;
    range.valueAsNumber = 0;
    range.oninput = function(){speed(Math.pow(2, 10-range.valueAsNumber));};
    ctx.strokeRect(MARL, MARL, WIDTH*SQ+2*MARG-MARL, HEIGHT*SQ+2*MARG-MARL);  // border
    start();
    inter = setInterval(update, 1024);
}

function sq(p, b=true, m=0) {
    if(p.x<0||p.x>=WIDTH||p.y<0||p.y>=HEIGHT)
        throw RangeError('('+p.x+', '+p.y+') is out of map ('+WIDTH+', '+HEIGHT+')');
    if(b) ctx.fillRect(MARG+p.x*SQ+PADD+m, MARG+p.y*SQ+PADD+m, SQ-2*PADD-2*m, SQ-2*PADD-2*m);
    else ctx.clearRect(MARG+p.x*SQ+PADD+m, MARG+p.y*SQ+PADD+m, SQ-2*PADD-2*m, SQ-2*PADD-2*m);
}

function isSamePosition(a, b) {
    return (a.x==b.x)&&(a.y==b.y);
}

function checkCollision(t) {
    for(var i=0; i<snakePos.length-1; ++i)
        if(isSamePosition(snakePos[i], t))
            return true;
    return false;
}

function getNewApple() {
    var t;
    do {
        t = {x:Math.floor(Math.random()*WIDTH),
             y:Math.floor(Math.random()*HEIGHT)}
    } while(checkCollision(t));
    apple = t;
    sq(apple, true, APPLEM);
}

function update() {
    var d = {x:0, y:0};
    switch(direction){
        case 'Up':    d.y = -1; break;
        case 'Down':  d.y = +1; break;
        case 'Left':  d.x = -1; break;
        case 'Right': d.x = +1; break;
        default: throw RangeError(direction+' is not a direction');
    }
    if((d.x+ld.x==0)&&(d.y+ld.y==0)&&(snakePos.length!=1))
        d = ld;
    ld = d;
    var l = snakePos[snakePos.length-1];
    var n = {x:(WIDTH+l.x+d.x)%WIDTH,
            y:(HEIGHT+l.y+d.y)%HEIGHT};
    snakePos.push(n);
    if(!isSamePosition(n, apple)) {
        var s = snakePos.shift();
        sq(s, false);
    } else getNewApple();
    sq(n);
    if(checkCollision(n)) {
        gameOver();
        return;
    }
}

function start() {
    ctx.clearRect(MARG, MARG, WIDTH*SQ, HEIGHT*SQ); // clear canvas
    // reset points
    snakePos = [{x:4,y:5}]; // reset snakePos
    direction = 'Up';   // reset direction
    getNewApple();  // get new apple
    ld = {x:0, y:-1};
}

function gameOver(){
    alert('Game over! You got '+snakePos.length+' points.');
    start();
}

function speed(x) {
    clearInterval(inter);
    inter = setInterval(update, x);
}