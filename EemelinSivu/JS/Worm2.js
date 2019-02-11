<<<<<<< HEAD
var Worm = {segments:1, dir:4};
var segmentX = [1];
var segmentY = [1];
var segmentdir = [4];
var hitWall = false;
var food = {x:3, y:3};
var gameTimer;
var sideLength = 5;
var gameSpeed = 700;
var cust = false;
var gridExist = false;
var windowSize = Math.floor(Math.min(window.innerWidth*0.7, window.innerHeight*0.7-100, 700));
console.log(windowSize);

window.addEventListener("keydown", direction);

function gameLoop() {
        console.log("start of game loop");
        Eat();
        Move();
        Draw();
//check if game should end
    if (Worm.segments >= (sideLength*sideLength)){
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
    if (gridExist == false) {generateCSS();generateGrid();}
    Worm = {segments:1, dir:4};
    segmentX = [1];
    segmentY = [1];
    segmentdir = [4];
    hitWall = false;
    generateFood();
    Draw();
}

//check for direction
function direction (e) {
    var x = e.keyCode;
    switch(x) {
        case 37: if(segmentdir[0] !== 4){
            console.log("left");
            Worm.dir = 2;
            }break;
            
        case 38: if(segmentdir[0] !== 3){
            console.log("up");
            Worm.dir = 1;
            }break;
            
        case 39: if(segmentdir[0] !== 2){
            console.log("right");
            Worm.dir = 4;
            }break;
            
        case 40: if(segmentdir[0] !== 1){
            console.log("down");
            Worm.dir = 3;
            }
    }
}

function startLoop() {
    gameTimer = setInterval(gameLoop, gameSpeed);
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
        segmentdir[i] = segmentdir[i-1];
    }
    console.log("the second segment is moving "+segmentdir[1]);
    //first segment moves one unit in 'dir' direction
    switch (Worm.dir) {
        case 1:
            segmentX[0]--;
            segmentdir[0] = 1;
            break;
        case 2:
            segmentY[0]--;
            segmentdir[0] = 2;
            break;
        case 3:
            segmentX[0]++;
            segmentdir[0] = 3;
            break;
        case 4:
            segmentY[0]++;
            segmentdir[0] = 4;
    }
//    for (var i = Worm.segments - 1;i > 0;i--) {
//
//    }

if (segmentX[0] == sideLength+1 || segmentX[0] == 0 || segmentY[0] == sideLength+1 || segmentY[0] == 0) {
    hitWall = true;  
    }
for (var i = 1; i<=Worm.segments; i++) {
    var x = segmentX[0];
    var y = segmentY[0];
    if (segmentX[i] == x && segmentY[i] == y){
        hitWall = true;
    }
}
console.log(segmentX[0]+","+segmentY[0]+" is head position");
}

function Draw() {
    var p = Math.PI;
    var u = windowSize/sideLength;
    var r = 0.45*u;
    var wormCell = document.getElementsByClassName("wormCell");
    console.log("Canvas elements to be deleted: "+wormCell.length);
    while (wormCell.length > 0){
        wormCell[0].parentNode.removeChild(wormCell[0]);
    }
    console.log("cell"+segmentX[0]+segmentY[0]);
    for (var i = 0; i < Worm.segments;i++ ){
        if (document.getElementById("cell"+segmentX[i]+","+segmentY[i]) !== null) 
        {
            console.log("Draw started");
            document.getElementById("cell"+segmentX[i]+","+segmentY[i]).insertAdjacentHTML("beforeend", "\
            <canvas class='wormCell' id='wormSeg"/*EK*/+i+"' width='"+u+"' height='"+u+"' style='position:absolute'></canvas>\
            ");
            var wormCanvas = document.getElementById("wormSeg"+i);
            var context = wormCanvas.getContext("2d");


            context.fillStyle = "black";
            if (i == 0 && Worm.segments > 1) {
                switch (segmentdir[0]) {
                    case (1):
                    //bottom
                        context.moveTo(.5*u,u);
                        context.arc(0.5*u,u,r,p,p*2);
                        
                        context.fill();
                    break;
                    case (2):
                    //right
                    context.moveTo(u,.5*u);
                        context.arc(u,0.5*u,r,0.5*p,1.5*p);
                        
                        context.fill();
                    break;
                    case (3):
                    //top
                    context.moveTo(.5*u,0);
                        context.arc(0.5*u,0,r,0,p);
                        
                        context.fill();
                    break;
                    case (4):
                    //left
                    context.moveTo(0,.5*u);
                        context.arc(0,0.5*u,r,1.5*p,0.5*p);
                        
                        context.fill();
                }
            }else if(i!==0){
                if(i < Worm.segments-1) {
                switch (segmentdir[i]) {
                    case (1):
                    context.moveTo(.5*u,u);
                        context.arc(0.5*u,u,r,p,p*2);
                        context.fillStyle = "black";
                        context.fill();

                    break;
                    case (2):
                    context.moveTo(u,.5*u);
                        context.arc(u,0.5*u,r,0.5*p,1.5*p);
                        context.fillStyle = "black";
                        context.fill();

                    break;
                    case (3):
                    context.moveTo(.5*u,0);
                        context.arc(0.5*u,0,r,0,p);
                        context.fillStyle = "black";
                        context.fill();

                    break;
                    case (4):
                    context.moveTo(0,.5*u);
                        context.arc(0,0.5*u,r,1.5*p,0.5*p);
                        context.fillStyle = "black";
                        context.fill();
                }
                }
                switch (segmentdir[i-1]) {
                    case (1):
                    context.moveTo(.5*u,0);
                        context.arc(0.5*u,0,r,0,p);
                        context.fillStyle = "black";
                        context.fill();

                    break;
                    case (2):
                    context.moveTo(0,.5*u);
                        context.arc(0,0.5*u,r,1.5*p,0.5*p);
                        context.fillStyle = "black";
                        context.fill();

                    break;
                    case (3):
                    context.moveTo(.5*u,u);
                        context.arc(0.5*u,u,r,p,p*2);
                        context.fillStyle = "black";
                        context.fill();

                    break;
                    case (4):
                    context.moveTo(u,.5*u);
                        context.arc(u,0.5*u,r,0.5*p,1.5*p);
                        context.fillStyle = "black";
                        context.fill();

                }
                
            }
            context.closePath();
            context.beginPath();
            context.arc(0.5*u,0.5*u,0.45*u,0,p*2);
            if (i == 0) {
                context.fillStyle = "#777777";
                context.fill();
            } else {
                context.fillStyle = "black";
                context.fill();
            }
        }
    }
}

function generateFood() {
    var u = windowSize/sideLength;
    var foodCell = document.getElementById("food");
    if(foodCell !== null){foodCell.parentNode.removeChild(foodCell)};
    food.x = Math.floor((Math.random() * sideLength) + 1);
    food.y = Math.floor((Math.random() * sideLength) + 1);
    console.log("food is at "+food.x+","+food.y);
    while (document.getElementById("cell"+food.x+","+food.y).children.length) {
    food.x = Math.floor((Math.random() * sideLength) + 1);
    food.y = Math.floor((Math.random() * sideLength) + 1);
    console.log("didnt work, new food is at "+food.x+","+food.y);
    }
    //draw food
    document.getElementById("cell"+food.x+","+food.y).insertAdjacentHTML("beforeend", "\
    <canvas id='food' width='"+u+"' height='"+u+"' style='position:absolute'></canvas>\
    ");
    var foodCanvas = document.getElementById("food");
    var context = foodCanvas.getContext("2d");
    context.arc(0.5*u, 0.5*u, 0.5*u, 0, Math.PI *8);
    context.fillStyle = "red";
    context.fill(); 

}

function addSegment() {
    segmentX[segmentX.length] = segmentX[segmentX.length-1];
    console.log("x cord of segment "+ segmentX.length + " is " +segmentX[segmentX.length-1]);
    segmentY[segmentY.length] = segmentY[segmentY.length-1];
    segmentdir[segmentdir.length] = segmentdir[segmentdir.length-1];
    Worm.segments++;
    console.log("addSegment ran through, new length is "+Worm.segments);

}

function generateGrid() {
var gridp = document.getElementById("wormGrid");
gridp.innerHTML = "";
for(var i = 1;i <= sideLength;i++) {
    for (var f = 1;f <= sideLength;f++) {
        var el = document.createElement("DIV");
        el.setAttribute("class","cell");
        el.setAttribute("id","cell"+i+","+f);
        if ( (((f-i)*(f-i)) /(f-i)+1)%2 !==0) {
            el.style = "grid-column:"+f+";grid-row:"+i+";background-color: rgb(192, 192, 192);";
        }else{
            el.style = "grid-column:"+f+";grid-row:"+i+";";
        }
        gridp.appendChild(el);
    }
}
gridExist = true;
}

function generateCSS() {
csse = document.getElementById("wormStyle");
csse.innerHTML = ".worm {\
    margin:auto;\
    border:5px solid green;\
    width: "+windowSize+"px;\
    height: "+windowSize+"px;\
    margin-top: "+Math.floor(windowSize/15)+"px;\
    display:grid;\
    grid-gap: 0px;\
}\
.cell{\
    min-width:"+Math.floor(windowSize/sideLength)+"px;\
    max-width:"+Math.floor(windowSize/sideLength)+"px;\
    min-height:"+Math.floor(windowSize/sideLength)+"px;\
    max-height:"+Math.floor(windowSize/sideLength)+"px;\
    margin:0px;\
    padding:0px;\
}\
";
}

function speedButton() {
if (cust == false) {
cust = true;
var b = document.getElementById("SpeedB");
var t = document.createElement("INPUT");
t.setAttribute("id","tempboxe");
t.setAttribute("type","number");
t.setAttribute("value",gameSpeed);
t.setAttribute("onclick","this.setAttribute('value','');");
b.parentNode.appendChild(t);
t = document.createElement("BUTTON");
t.setAttribute("onclick","speedBFunc();");
t.setAttribute("id","tempbute");
t.innerHTML = "Submit";
b.parentNode.appendChild(t);
b.parentNode.addEventListener("keydown",enterSubmit);
}
}

function sizeButton() {
if (cust == false) {
cust = true;
var b = document.getElementById("SizeB");
var t = document.createElement("INPUT");
t.setAttribute("id","tempboxi");
t.setAttribute("type","number");
t.setAttribute("value",sideLength);
t.setAttribute("onclick","this.setAttribute('value','');");
t.setAttribute("min","2");
b.parentNode.appendChild(t);
t = document.createElement("BUTTON");
t.setAttribute("onclick","sizeBFunc();");
t.setAttribute("id","tempbuti");
t.innerHTML = "Submit";
b.parentNode.appendChild(t);
b.parentNode.addEventListener("keydown",enterSubmit);
}
}

function speedBFunc() {
    gameSpeed = parseInt(document.getElementById("tempboxe").value);
    if (!gameSpeed){gameSpeed = 700;}
    document.getElementById("dispspe").innerHTML = "The speed is set to "+(gameSpeed/1000)+"s";
    var tel = document.getElementById("tempboxe");
    tel.parentNode.removeEventListener("keydown",enterSubmit);
    tel.parentNode.removeChild(tel);
    tel = document.getElementById("tempbute");
    tel.parentNode.removeChild(tel);
    cust = false;
}

function sizeBFunc() {
    var x = document.getElementById("tempboxi");
    sideLength = parseInt(x.value);
    if (!sideLength)
        {sideLength = 5;}
    if (sideLength < 2)
        {sideLength = 2;}
    document.getElementById("displen").innerHTML = "The grid is set to be "+sideLength+"x"+sideLength+"  ";
    var tel = document.getElementById("tempboxi");
    tel.parentNode.removeEventListener("keydown",enterSubmit);
    tel.parentNode.removeChild(tel);
    tel = document.getElementById("tempbuti");
    tel.parentNode.removeChild(tel);
    generateGrid();
    generateCSS();
    cust = false;
}

function enterSubmit(e) {
    x = e.keyCode;
    if (x == 13) {
        if(document.getElementById("tempbute")) {
            speedBFunc();
        }else if (document.getElementById("tempbuti")) {
            sizeBFunc();
        }
    }
=======
var Worm = {segments:1, dir:4};
var segmentX = [1];
var segmentY = [1];
var segmentdir = [4];
var hitWall = false;
var food = {x:3, y:3};
var gameTimer;
var sideLength = 5;
var gameSpeed = 700;
var cust = false;
var gridExist = false;
var windowSize = Math.floor(Math.min(window.innerWidth*0.7, window.innerHeight*0.7-100, 700));
console.log(windowSize);

window.addEventListener("keydown", direction);

function gameLoop() {
        console.log("start of game loop");
        Eat();
        Move();
        Draw();
//check if game should end
    if (Worm.segments >= (sideLength*sideLength)){
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
    if (gridExist == false) {generateCSS();generateGrid();}
    Worm = {segments:1, dir:4};
    segmentX = [1];
    segmentY = [1];
    segmentdir = [4];
    hitWall = false;
    generateFood();
    Draw();
}

//check for direction
function direction (e) {
    var x = e.keyCode;
    switch(x) {
        case 37: if(segmentdir[0] !== 4){
            console.log("left");
            Worm.dir = 2;
            }break;
            
        case 38: if(segmentdir[0] !== 3){
            console.log("up");
            Worm.dir = 1;
            }break;
            
        case 39: if(segmentdir[0] !== 2){
            console.log("right");
            Worm.dir = 4;
            }break;
            
        case 40: if(segmentdir[0] !== 1){
            console.log("down");
            Worm.dir = 3;
            }
    }
}

function startLoop() {
    gameTimer = setInterval(gameLoop, gameSpeed);
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
        segmentdir[i] = segmentdir[i-1];
    }
    console.log("the second segment is moving "+segmentdir[1]);
    //first segment moves one unit in 'dir' direction
    switch (Worm.dir) {
        case 1:
            segmentX[0]--;
            segmentdir[0] = 1;
            break;
        case 2:
            segmentY[0]--;
            segmentdir[0] = 2;
            break;
        case 3:
            segmentX[0]++;
            segmentdir[0] = 3;
            break;
        case 4:
            segmentY[0]++;
            segmentdir[0] = 4;
    }
//    for (var i = Worm.segments - 1;i > 0;i--) {
//
//    }

if (segmentX[0] == sideLength+1 || segmentX[0] == 0 || segmentY[0] == sideLength+1 || segmentY[0] == 0) {
    hitWall = true;  
    }
for (var i = 1; i<=Worm.segments; i++) {
    var x = segmentX[0];
    var y = segmentY[0];
    if (segmentX[i] == x && segmentY[i] == y){
        hitWall = true;
    }
}
console.log(segmentX[0]+","+segmentY[0]+" is head position");
}

function Draw() {
    var p = Math.PI;
    var u = windowSize/sideLength;
    var r = 0.45*u;
    var wormCell = document.getElementsByClassName("wormCell");
    console.log("Canvas elements to be deleted: "+wormCell.length);
    while (wormCell.length > 0){
        wormCell[0].parentNode.removeChild(wormCell[0]);
    }
    console.log("cell"+segmentX[0]+segmentY[0]);
    for (var i = 0; i < Worm.segments;i++ ){
        if (document.getElementById("cell"+segmentX[i]+","+segmentY[i]) !== null) 
        {
            console.log("Draw started");
            document.getElementById("cell"+segmentX[i]+","+segmentY[i]).insertAdjacentHTML("beforeend", "\
            <canvas class='wormCell' id='wormSeg"/*EK*/+i+"' width='"+u+"' height='"+u+"' style='position:absolute'></canvas>\
            ");
            var wormCanvas = document.getElementById("wormSeg"+i);
            var context = wormCanvas.getContext("2d");


            context.fillStyle = "black";
            if (i == 0 && Worm.segments > 1) {
                switch (segmentdir[0]) {
                    case (1):
                    //bottom
                        context.moveTo(.5*u,u);
                        context.arc(0.5*u,u,r,p,p*2);
                        
                        context.fill();
                    break;
                    case (2):
                    //right
                    context.moveTo(u,.5*u);
                        context.arc(u,0.5*u,r,0.5*p,1.5*p);
                        
                        context.fill();
                    break;
                    case (3):
                    //top
                    context.moveTo(.5*u,0);
                        context.arc(0.5*u,0,r,0,p);
                        
                        context.fill();
                    break;
                    case (4):
                    //left
                    context.moveTo(0,.5*u);
                        context.arc(0,0.5*u,r,1.5*p,0.5*p);
                        
                        context.fill();
                }
            }else if(i!==0){
                if(i < Worm.segments-1) {
                switch (segmentdir[i]) {
                    case (1):
                    context.moveTo(.5*u,u);
                        context.arc(0.5*u,u,r,p,p*2);
                        context.fillStyle = "black";
                        context.fill();

                    break;
                    case (2):
                    context.moveTo(u,.5*u);
                        context.arc(u,0.5*u,r,0.5*p,1.5*p);
                        context.fillStyle = "black";
                        context.fill();

                    break;
                    case (3):
                    context.moveTo(.5*u,0);
                        context.arc(0.5*u,0,r,0,p);
                        context.fillStyle = "black";
                        context.fill();

                    break;
                    case (4):
                    context.moveTo(0,.5*u);
                        context.arc(0,0.5*u,r,1.5*p,0.5*p);
                        context.fillStyle = "black";
                        context.fill();
                }
                }
                switch (segmentdir[i-1]) {
                    case (1):
                    context.moveTo(.5*u,0);
                        context.arc(0.5*u,0,r,0,p);
                        context.fillStyle = "black";
                        context.fill();

                    break;
                    case (2):
                    context.moveTo(0,.5*u);
                        context.arc(0,0.5*u,r,1.5*p,0.5*p);
                        context.fillStyle = "black";
                        context.fill();

                    break;
                    case (3):
                    context.moveTo(.5*u,u);
                        context.arc(0.5*u,u,r,p,p*2);
                        context.fillStyle = "black";
                        context.fill();

                    break;
                    case (4):
                    context.moveTo(u,.5*u);
                        context.arc(u,0.5*u,r,0.5*p,1.5*p);
                        context.fillStyle = "black";
                        context.fill();

                }
                
            }
            context.closePath();
            context.beginPath();
            context.arc(0.5*u,0.5*u,0.45*u,0,p*2);
            if (i == 0) {
                context.fillStyle = "#777777";
                context.fill();
            } else {
                context.fillStyle = "black";
                context.fill();
            }
        }
    }
}

function generateFood() {
    var u = windowSize/sideLength;
    var foodCell = document.getElementById("food");
    if(foodCell !== null){foodCell.parentNode.removeChild(foodCell)};
    food.x = Math.floor((Math.random() * sideLength) + 1);
    food.y = Math.floor((Math.random() * sideLength) + 1);
    console.log("food is at "+food.x+","+food.y);
    while (document.getElementById("cell"+food.x+","+food.y).children.length) {
    food.x = Math.floor((Math.random() * sideLength) + 1);
    food.y = Math.floor((Math.random() * sideLength) + 1);
    console.log("didnt work, new food is at "+food.x+","+food.y);
    }
    //draw food
    document.getElementById("cell"+food.x+","+food.y).insertAdjacentHTML("beforeend", "\
    <canvas id='food' width='"+u+"' height='"+u+"' style='position:absolute'></canvas>\
    ");
    var foodCanvas = document.getElementById("food");
    var context = foodCanvas.getContext("2d");
    context.arc(0.5*u, 0.5*u, 0.5*u, 0, Math.PI *8);
    context.fillStyle = "red";
    context.fill(); 

}

function addSegment() {
    segmentX[segmentX.length] = segmentX[segmentX.length-1];
    console.log("x cord of segment "+ segmentX.length + " is " +segmentX[segmentX.length-1]);
    segmentY[segmentY.length] = segmentY[segmentY.length-1];
    segmentdir[segmentdir.length] = segmentdir[segmentdir.length-1];
    Worm.segments++;
    console.log("addSegment ran through, new length is "+Worm.segments);

}

function generateGrid() {
var gridp = document.getElementById("wormGrid");
gridp.innerHTML = "";
for(var i = 1;i <= sideLength;i++) {
    for (var f = 1;f <= sideLength;f++) {
        var el = document.createElement("DIV");
        el.setAttribute("class","cell");
        el.setAttribute("id","cell"+i+","+f);
        if ( (((f-i)*(f-i)) /(f-i)+1)%2 !==0) {
            el.style = "grid-column:"+f+";grid-row:"+i+";background-color: rgb(192, 192, 192);";
        }else{
            el.style = "grid-column:"+f+";grid-row:"+i+";";
        }
        gridp.appendChild(el);
    }
}
gridExist = true;
}

function generateCSS() {
csse = document.getElementById("wormStyle");
csse.innerHTML = ".worm {\
    margin:auto;\
    border:5px solid green;\
    width: "+windowSize+"px;\
    height: "+windowSize+"px;\
    margin-top: "+Math.floor(windowSize/15)+"px;\
    display:grid;\
    grid-gap: 0px;\
}\
.cell{\
    min-width:"+Math.floor(windowSize/sideLength)+"px;\
    max-width:"+Math.floor(windowSize/sideLength)+"px;\
    min-height:"+Math.floor(windowSize/sideLength)+"px;\
    max-height:"+Math.floor(windowSize/sideLength)+"px;\
    margin:0px;\
    padding:0px;\
}\
";
}

function speedButton() {
if (cust == false) {
cust = true;
var b = document.getElementById("SpeedB");
var t = document.createElement("INPUT");
t.setAttribute("id","tempboxe");
t.setAttribute("type","number");
t.setAttribute("value",gameSpeed);
t.setAttribute("onclick","this.setAttribute('value','');");
b.parentNode.appendChild(t);
t = document.createElement("BUTTON");
t.setAttribute("onclick","speedBFunc();");
t.setAttribute("id","tempbute");
t.innerHTML = "Submit";
b.parentNode.appendChild(t);
b.parentNode.addEventListener("keydown",enterSubmit);
}
}

function sizeButton() {
if (cust == false) {
cust = true;
var b = document.getElementById("SizeB");
var t = document.createElement("INPUT");
t.setAttribute("id","tempboxi");
t.setAttribute("type","number");
t.setAttribute("value",sideLength);
t.setAttribute("onclick","this.setAttribute('value','');");
t.setAttribute("min","2");
b.parentNode.appendChild(t);
t = document.createElement("BUTTON");
t.setAttribute("onclick","sizeBFunc();");
t.setAttribute("id","tempbuti");
t.innerHTML = "Submit";
b.parentNode.appendChild(t);
b.parentNode.addEventListener("keydown",enterSubmit);
}
}

function speedBFunc() {
    gameSpeed = parseInt(document.getElementById("tempboxe").value);
    if (!gameSpeed){gameSpeed = 700;}
    document.getElementById("dispspe").innerHTML = "The speed is set to "+(gameSpeed/1000)+"s";
    var tel = document.getElementById("tempboxe");
    tel.parentNode.removeEventListener("keydown",enterSubmit);
    tel.parentNode.removeChild(tel);
    tel = document.getElementById("tempbute");
    tel.parentNode.removeChild(tel);
    cust = false;
}

function sizeBFunc() {
    var x = document.getElementById("tempboxi");
    sideLength = parseInt(x.value);
    if (!sideLength)
        {sideLength = 5;}
    if (sideLength < 2)
        {sideLength = 2;}
    document.getElementById("displen").innerHTML = "The grid is set to be "+sideLength+"x"+sideLength+"  ";
    var tel = document.getElementById("tempboxi");
    tel.parentNode.removeEventListener("keydown",enterSubmit);
    tel.parentNode.removeChild(tel);
    tel = document.getElementById("tempbuti");
    tel.parentNode.removeChild(tel);
    generateGrid();
    generateCSS();
    cust = false;
}

function enterSubmit(e) {
    x = e.keyCode;
    if (x == 13) {
        if(document.getElementById("tempbute")) {
            speedBFunc();
        }else if (document.getElementById("tempbuti")) {
            sizeBFunc();
        }
    }
>>>>>>> e934609dbd71d2d8ce2af3e516fec7d988d9335b
}