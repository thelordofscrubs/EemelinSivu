var Worm = {segments:1, dir:4}
var segmentX = [1]
var segmentY = [1]
var hitWall = false
var food = {x:3, y:3}
var gameTimer;

window.addEventListener("keydown", direction);

function gameLoop() {
        console.log("tick");
        Eat();
        Move();
        Draw();
        console.log("tick.2");
//check if game should end
    if (Worm.segments >= 25){
        clearInterval(gameTimer);
        alert("Congratulations, You Win!");
        startGame();
    } if (hitWall == true){
        clearInterval(gameTimer);
        alert("Nice Job, You Achieved a Length of " + Worm.segments + "!");
        startGame();
    }

}

//Run at start
function startGame(){
    Worm = {segments:1, dir:4};
    segmentX = [1]
    segmentY = [1]
    hitWall = false
    food = {x:3, y:3}
    generateFood();
    Draw();
}

//check for direction
function direction (e) {
    var x = e.keyCode;
    switch(x) {
        case 37:
            console.log("left");
            Worm.dir = 1;
            break;
        case 38:
            console.log("up");
            Worm.dir = 2;
            break;
        case 39:
            console.log("right");
            Worm.dir = 3;
            break;
        case 40:
            console.log("down");
            Worm.dir = 4;
    }
}

function startLoop() {
    gameTimer = setInterval(gameLoop, 700);
}
//End of top-level functions

function Eat() {
if (segmentX[0] == food.x && segmentY[0] == food.y){
    addSegment();
    generateFood();

}

}


function Move() {
    console.log(hitWall);
    //each segment gets the coordinates of the one before it
    for (var i = Worm.segments - 1; i > 0; i--) {
        segmentX[i] = segmentX[i-1];
        segmentY[i] = segmentY[i-1];

    }
    //first segment moves one unit in 'dir' direction
    switch (Worm.dir) {
        case 1:
            segmentX[0]--;
            break;
        case 2:
            segmentY[0]--;
            break;
        case 3:
            segmentX[0]++;
            break;
        case 4:
            segmentY[0]++;
    }
    

if (segmentX[0] == 6 || segmentX[0] == 0 || segmentY[0] == 6 || segmentY[0] == 0) {
    hitWall = true;  
    }
for (var i = 1; i<=Worm.segments; i++) {
    var x = segmentX[0];
    var y = segmentY[0];
    if (segmentX[i] == x && segmentY[i] == y){
        hitWall = true;
    }
}
console.log(segmentX[0]+","+segmentY[0]+"head");
}

function Draw() {
    var wormCell = document.getElementsByClassName("wormCell");
    console.log(wormCell.length);
    while (wormCell.length > 0){
        wormCell[0].parentNode.removeChild(wormCell[0]);
    }
    console.log("cell"+segmentX[0]+segmentY[0]);
    for (var i = 0; i < Worm.segments;i++ ){
        if (document.getElementById("cell"+segmentX[i]+segmentY[i]) !== null) {console.log("Draw started");
        document.getElementById("cell"+segmentX[i]+segmentY[i]).insertAdjacentHTML("beforeend", "\
        <canvas class='wormCell' id='wormSeg"+i+"' width='100%' height='100%' style='position:absolute'></canvas>\
        ");
        var wormCanvas = document.getElementById("wormSeg"+i);
        var context = wormCanvas.getContext("2d");
        var length = document.getElementById("cell11").clientWidth;
        context.arc(0.5*length,0.5*length,0.45*length,0,Math.PI *8);
        if(i == 0) {
            context.fillStyle = "#424242";
        }else {
            context.fillStyle = "black";
        }
        context.fill();
    }
    }

}

function generateFood() {
    var foodCell = document.getElementById("food");
    if(foodCell !== null){foodCell.parentNode.removeChild(foodCell)};
    food.x = Math.floor((Math.random() * 5) + 1);
    food.y = Math.floor((Math.random() * 5) + 1);
    console.log("food is at "+food.x+","+food.y);
    while (document.getElementById("cell"+food.x+food.y).children.length) {
    food.x = Math.floor((Math.random() * 5) + 1);
    food.y = Math.floor((Math.random() * 5) + 1);
    console.log("didnt work, new food is at "+food.x+","+food.y);
    }
    var length = document.getElementById("cell11").clientWidth;
    //draw food
    document.getElementById("cell"+food.x+food.y).insertAdjacentHTML("beforeend", "\
    <canvas id='food' width='100' height='100' style='position:absolute'></canvas>\
    ");
    var foodCanvas = document.getElementById("food");
    var context = foodCanvas.getContext("2d");
    context.arc(0.5*length, 0.5*length, 0.5*length, 0, Math.PI *8);
    context.fillStyle = "red";
    context.fill(); 

}

function addSegment() {
    segmentX[segmentX.length] = segmentX[segmentX.length-1];
    console.log("x cord of segment "+ segmentX.length + " is " +segmentX[segmentX.length-1]);
    segmentY[segmentY.length] = segmentY[segmentY.length-1];
    Worm.segments++; 
    console.log("addSegment ran through, new length is "+Worm.segments);

}

function keyPress(e) {
    var x = e.which;
    switch(x) {
        case 37:
            Worm.dir = 1
            break;
        case 38:
            Worm.dir = 2
            break;
        case 39:
            Worm.dir = 3
            break;
        case 40:
            Worm.dir = 4
    }

}