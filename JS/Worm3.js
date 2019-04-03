var wormSegments = [new wormSegment([1,1],2, 0)]
var gameTimer;
var sideLength = 6;
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
console.log(document.cookie);
window.addEventListener("keydown", direction);
//document.onloadend = setTimeout(getCookies(),500);
//window.beforeunload = saveCookies();
window.addEventListener("beforeunload",saveCookies);

function gameLoop() {
    console.log("start of game loop");
    Eat();
    for (var i = wormSegments.length; i >= 0 ; i--) {
        wormSegments[i].updatePos();
        wormSegments[i].draw();
    }
//check if game should end
if (wormSegments.length >= (sideLength*sideLength)){
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
    writeScore(wormSegments.length);
    startGame();
} if (hitWall == true){
    clearInterval(gameTimer);
    if(currentName == "Guest") {
        currentName = prompt("Nice Job, You Achieved a Length of " + wormSegments.length + "!\nPlease enter your name", "Name");
        while (currentName.length > 9) {
            currentName = prompt("That name was too long, please enter less than 9 character", "Name");
        }
        if (!currentName || currentName == "Name") {
            currentName = "Guest";
        }
    } else {
        alert("Nice Job, You Achieved a Length of " + wormSegments.length + ".");
    }
    writeScore(wormSegments.length);
    startGame();
}

}


//*********************************END OF TOP LEVEL FUNCTIONS*******************************

function wormSegment(pos, dir, wsi) {
    this.xyCord = pos;
    this.direction = dir;
    this.segmentIndex = wsi;
    function draw() {
        xy = this.xyCord;
        dir = this.direction;
        if (this.segmentIndex == wormSegments.length-1) {
            isLast = true;
        } else {
            isLast = false;
        }

    }
    function updatePos() {
        if (this.segmentIndex == 0) {
            xy0 = this.xyCord;
            switch (this.direction) {
                case 1:
                    xy0[1] += 1;
                    break; 
                case 2:
                    xy0[0] += 1;
                    break;
                case 3:
                    xy0[1] -= 1;
                    break;
                case 4:
                    xy0[0] -= 1;
            }
        } else {
            xy0 = wormSegments[this.segmentIndex-1].xyCord;
        }
        this.xyCord = xy0;
        if (this.xyCord[0] == 0 || this.xyCord[0] == sideLength+1 || this.xyCord[1] == 0 || this.xyCord[1] == sideLength+1) {
            hitWall = true;
        }
    }
}

function saveCookies() {
    var d = new Date();
    d.setTime(d.getTime() + (365*24*60*60*1000));
    console.log(JSON.stringify(scores));
    var cStr = "scores="+JSON.stringify(scores)+";expires="+d.toUTCString()+";path=/Worm2.html";
    console.log(cStr);
    //console.log(d.toUTCString());
    //document.cookie = "expires=-1;path=/Worm2.html";
    document.cookie = cStr;
    //console.log(document.cookie);
}

function getCookies() {
    if (document.cookie) {
        console.log(document.cookie);
        var x = decodeURIComponent(document.cookie);
        console.log(x);
        //for some reason document.cookie.indexOf(";") was cutting off the last square bracket on only the actual server and this "temporary" fix is the best i could come up with
        x = x.slice(document.cookie.search("scores"),document.cookie.indexOf("]")+1);
        console.log(x);
        scores = JSON.parse(x.slice(7));
        generateScoreTable();
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
    if (!currentName || currentName == "Name") {
        currentName = "Guest";
        alert("That was an invalid name");
    }
    
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
    if (scores.length > 5) {
        scores.length = 5;
    }
    generateScoreTable();
    sendScore(newScore);
}

function generateScore(tsc) {
    var z = currentName;
    currentName = "forTestingOnly";
    writeScore(tsc);
    currentName=z;
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
    xr.open("GET", "/PHP/Worm2.php?q="+hscorejson+"&w="+hc,true);
    xr.send();
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