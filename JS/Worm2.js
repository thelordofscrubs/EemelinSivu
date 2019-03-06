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
var currentName = "Guest";
var scores = [];
var hscores = [];
var hscoresP;
var hc = 2;
console.log(windowSize);

window.addEventListener("keydown", direction);
document.onloadend = getCookies();
window.beforeunload = saveCookies();

function gameLoop() {
        console.log("start of game loop");
        Eat();
        Move();
        Draw();
//check if game should end
    if (Worm.segments >= (sideLength*sideLength)){
        clearInterval(gameTimer);
        if(currentName == "Guest") {
            currentName = prompt("Congratulations, You Win!\nPlease enter your name", "Name");
            while (currentName.length > 9) {
                currentName = prompt("That name was too long, please enter less than 9 character", "Name");
            }
            if (!currentName || currentName == "Name") {
                currentName = "Guest";
            }
        } else {
            alert("Congratulations, You Win!");
        }
        writeScore(Worm.segments);
        startGame();
    } if (hitWall == true){
        clearInterval(gameTimer);
        if(currentName == "Guest") {
            currentName = prompt("Nice Job, You Achieved a Length of " + Worm.segments + "!\nPlease enter your name", "Name");
            while (currentName.length > 9) {
                currentName = prompt("That name was too long, please enter less than 9 character", "Name");
            }
            if (!currentName || currentName == "Name") {
                currentName = "Guest";
            }
        } else {
            alert("Nice Job, You Achieved a Length of " + Worm.segments + ".");
        }
        writeScore(Worm.segments);
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
    generateFood(2);
    Draw();
}

//arrowkey detector
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

//End of top-level functions **********************************************************************************

function saveCookies() {
    var d = new Date();
    d.setTime(d.getTime() + (365*24*60*60*1000));
    console.log(JSON.stringify(scores));
    var cStr = "scores="+JSON.stringify(scores)+";expires="+d.toUTCString()+";path=/Worm2.html";
    //console.log(d.toUTCString());
    document.cookie = "expires=-1;path=/Worm2.html";
    document.cookie = cStr;
    //console.log(document.cookie);
}

function getCookies() {
    if (document.cookie) {
        var x = decodeURIComponent(document.cookie);
        x.split(';',1);
        //console.log(x);
        scores = JSON.parse(x);
    }
}

function getHScores() {
        console.log("started getHScores");
        var xr = new XMLHttpRequest();
        console.log(xr);
        xr.onreadystatechange = function() {
            if(this.readyState == 4 && this.status == 200) {
                console.log(this.responseXML);
                var x = this.responseXML;
                console.log(x);
                //console.log(x.length);
                console.log(x.getElementsByTagName("name").length)
                for (var i = 0;i < x.getElementsByTagName("name").length;i++) {
                    hscores[i] = new scoreObject(x.getElementsByTagName("name")[i].childNodes[0].nodeValue , x.getElementsByTagName("score")[i].childNodes[0].nodeValue , x.getElementsByTagName("size")[i].childNodes[0].nodeValue , x.getElementsByTagName("speed")[i].childNodes[0].nodeValue);
                }
                console.log(hscores);
            }
        }
        xr.open("GET","/XML/Worm2.xml",true);
        xr.send();
}

function getName() {
    var nameBox = document.getElementById("nameField");
    currentName = nameBox.value;
    nameBox.value = "Name";
}

function getNameStart() {
    window.addEventListener("keydown", enterName);
    document.getElementById("nameField").value = "";
}

function enterName(e) {
    var x = e.keyCode;
    if (x == 13) {
        getName();
        window.removeEventListener("keydown", enterName);
    }
}

function scoreObject(n, s, z, p) {
    this.name = n;
    this.score = s;
    this.size = z;
    this.speed = p;
}

function writeScore(x) {
    scores[scores.length] = new scoreObject(currentName, x, sideLength, gameSpeed);
    var newScore = scores[scores.length-1]
    scores.sort(function(a,b){return (a.score-b.score)*(-1)});
    generateScoreTable();
    sendScore(newScore);
}

function writeOnlineScore() {

}

function sendScore(score) {
    console.log("started senScore");
    var xr = new XMLHttpRequest();
    xr.onreadystatechange = function() {
        console.log("ready state is"+ xr.readyState);
        if (this.readyState == 4 && this.status == 200) {
            console.log("sendscore php returned status 200");
            generateOnScoreTable();
        }
        if (this.responseText) {
            console.log(this.responseText);
        }
    }
    var hscorejson = JSON.stringify(score);
    xr.open("GET", "/PHP/Worm2.php?q="+hscorejson+"&w="+hc,true)
    xr.send();
}

function Eat() {
if (segmentX[0] == food.x && segmentY[0] == food.y){
    addSegment();
    if (Worm.segments < (sideLength**2)) {
    generateFood();
    }
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
    var u = Math.ceil(windowSize/sideLength);
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

function generateFood(x) {
    var u = windowSize/sideLength;
    var foodCell = document.getElementById("food");
    if(foodCell !== null){foodCell.parentNode.removeChild(foodCell)};
    var ac = [];
    var cl = document.getElementsByClassName("cell");
    console.log(cl)
    for (var i = 0; i<cl.length; i++) {
        if (!cl[i].childElementCount) {
            //cl[i].className += " openCell";
            ac[ac.length] = cl[i];
        }
    }
    console.log(ac);
    console.log(ac.length)
    //console.log(ac.length*Math.random())
    //console.log(Math.floor(Math.random() * ac.length))
    console.log(ac[Math.floor(Math.random() * ac.length)])
    if (ac.length) {
        //foodCell = document.getElementsByClassName("openCell")[Math.floor(Math.random() * document.getElementsByClassName("openCell").length)];
        //console.log(document.getElementsByClassName("openCell"));
        foodCell = ac[Math.floor(Math.random() * ac.length)];
        var id = foodCell.id;
        var t = id.split(",");
        food.x = parseInt(t[0].slice(4));
        food.y = parseInt(t[1]);
        //food.x = Math.floor((Math.random() * sideLength) + 1);
        //food.y = Math.floor((Math.random() * sideLength) + 1);
        console.log("food is at "+food.x+","+food.y);
        //if(Worm.segments < (sideLength**2-1)) {
        //    while (document.getElementById("cell"+food.x+","+food.y).children.length) {
        //        food.x = Math.floor((Math.random() * sideLength) + 1);
        //        food.y = Math.floor((Math.random() * sideLength) + 1);
        //        console.log("didnt work, new food is at "+food.x+","+food.y);
        //    }
        //}
        //draw food
        //document.getElementById("cell"+food.x+","+food.y).insertAdjacentHTML("beforeend", "\
        //<canvas id='food' width='"+u+"' height='"+u+"' style='position:absolute'></canvas>\
        //");
        //var foodCanvas = document.getElementById("food");
        //var context = foodCanvas.getContext("2d");
        //context.arc(0.5*u, 0.5*u, 0.5*u, 0, Math.PI *8);
        //context.fillStyle = "red";
        //context.fill(); 
        console.log("cell"+food.x+","+food.y);
        var fCell = document.getElementById("cell"+food.x+","+food.y);
        console.log(fCell);
        console.log(foodCell);
        foodCell.insertAdjacentHTML("beforeend","\
        <img src='./pictures/omena.jpg' id='food' width='"+u+"' height='"+u+"' style='position:absolute'/>\
        ");
    }
}

function addSegment() {
    segmentX[segmentX.length] = segmentX[segmentX.length-1];
    console.log("x cord of segment "+ segmentX.length + " is " +segmentX[segmentX.length-1]);
    segmentY[segmentY.length] = segmentY[segmentY.length-1];
    segmentdir[segmentdir.length] = segmentdir[segmentdir.length-1];
    Worm.segments++;
    hc++;
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
generateScoreTable();
gridExist = true;
}

function generateScoreTable() {
    var sg = document.getElementById("scoreTable");
    sg.innerHTML = "<tr>\
    <th>Name</th>\
    <th>Score</th>\
    <th>Board Size</th>\
    <th>Game Speed</th>\
    </tr>";
    for (var i = 0; i < scores.length; i++) {
        sg.insertAdjacentHTML("beforeend" , "\
        <tr class='scoreRow'> <td>"+scores[i].name+"</td> <td class='score'>"+scores[i].score+"</td> <td>"+scores[i].size+" x "+scores[i].size+"</td> <td>"+scores[i].speed+"</td> </tr>\
        \
        ");
    }
}

function generateOnScoreTable() {
    getHScores();
    var sg = document.getElementById("oScoreTable");
    console.log("found oTable");
    sg.innerHTML = "<tr>\
    <th>Name</th>\
    <th>Score</th>\
    <th>Board Size</th>\
    <th>Game Speed</th>\
    </tr>";
    console.log("wrote headers");
    console.log(hscores);
    console.log(hscores.length);
    window.setTimeout(function() {
        for (var i = 0; i < hscores.length; i++) {
            sg.insertAdjacentHTML("beforeend" , "\
            <tr class='scoreRow'> <td>"+hscores[i].name+"</td> <td class='score'>"+hscores[i].score+"</td> <td>"+hscores[i].size+"x"+hscores[i].size+"</td> <td>"+hscores[i].speed+"</td> </tr>\
            \
            ");
        }}
    ,500)
}

//window.onload = generateOnScoreTable();

function generateCSS() {
var leftoverPx = windowSize - Math.ceil(windowSize/sideLength-.6) * sideLength;
csse = document.getElementById("wormStyle");
csse.innerHTML = ".worm {\
    margin:auto;\
    border:5px solid green;\
    width: "+windowSize+"px;\
    height: "+windowSize+"px;\
    display:grid;\
    grid-gap: 0px;\
    justify-content:center;\
    padding:0px;\
}\
.cell{\
    min-width:"+windowSize/sideLength+"px;\
    max-width:"+windowSize/sideLength+"px;\
    min-height:"+windowSize/sideLength+"px;\
    max-height:"+windowSize/sideLength+"px;\
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
}