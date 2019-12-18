var mapCanvas;
var mapContext;
var spriteCanvas;
var spriteContext;
var mapColorCanvas;
var mapColorContext;
var uiCanvas;
var uiContext;
var canvasSize = [1000, 750];
var gameLoop;
var spawners = [];
var mapSize = [100, 75];
var teams = [];
var unitGroups = [];
var groupGroups = [];
var defaultMoveSpeed = .05;
const unitTypes = {SWORD: "sword", ARCHER: "archer", MAGE: "mage"};
const mapTypes = {ISLAND: "isle", MOUNTAIN_LEFT: "mtnl", MOUNTAIN_TOP: "mtnt", OCEAN_LEFT: "ocnl", OCEAN_TOP: "ocnt", VALLEY: "vale", PLAIN: "flat"};
const colors = {MAP_GREEN: "#2bcf62", TEAM_BLUE: "#203cf5", TEAM_RED: "#d10000", TEAM_PURPLE: "#bb00c4", TEAM_WHITE: "#FFFFFF"};

var mapCellGrid = [];
for (let i = 0; i < mapSize[0]/5; i++) {
    mapCellGrid[i] = [];
    for (let f = 0; f < mapSize[1]/5; f++) {
        mapCellGrid[i][f] = [];
    }
}
var cellSize = [mapCellGrid.length, mapCellGrid[0].length];

//constructor for a group of units
function unitGroup(team = 1, size = 10, position = new Vector2(10, 10), unitType = unitTypes.SWORD, movingTo = {coords: new Vector2(0, 0), movementDirection: new Vector2(0,0), currentlyMoving:false}, radius = 2, speed = defaultMoveSpeed) {
    this.incrementSize = function () {
        this.size++;
        this.radius = findDigits(size);
    }
    this.changeSize = function (amt = -5) {
        this.size += amt;
        this.radius = findDigits(size);
    }
    this.setDestination = function (dest = new Vector2(10,10)) {
        this.movingTo.coords = dest;
        this.movingTo.movementDirection = dest.returnCopy().sub(position);
        this.movingTo.currentlyMoving = true;
    }
    this.updatePos = function () {
        this.position.add(this.movingTo.movementDirection.unit*this.movementSpeed);
    }
    if (!movingTo) {
        movingTo = {coords: new Vector2(0,0), movementDirection: new Vector2(0,0), currentlyMoving: false};
    }
    this.team = team;
    this.size = size;
    this.position = position;
    this.unitType = unitType;
    this.movingTo = movingTo;
    this.movementSpeed = speed;
    //radius is also used as a size metric for visualizing groups, and increments at every power of ten
    this.radius = radius;
    this.currentCell = [Math.floor(position.x/5), Math.floor(position.y/5)];
    mapCellGrid[currentCell[0]][currentCCell[1]].push(this)
}

//constructor for a group of unit groups of different types
function groupGroup(team = 1, size = 2, position = new Vector2(10,10), movingTo = {coords: new Vector2(10, 10), currentlyMoving:false}, speed = defaultMoveSpeed/2) {

}

function team(name = "neutral", number = 0, color = colors.TEAM_WHITE) {
    this.changeStrength = function (amt) {
        this.strength += amt;
    }

    this.name = name;
    this.number = number;
    this.strength = 10;
    this.color = color;
}

teams[0] = new team("player", 0, colors.TEAM_PURPLE);
teams[1] = new team("neutral", 1);

function spawner(team = 0, size = 1, position = new Vector2(20,20), upgradeLevel = 0, currentUnit = unitTypes.SWORD, possibleUnits = [unitTypes.SWORD]) {
    this.changeTeam = function (newTeam) {
        this.team = newTeam;
    }

    this.activate = function () {
        this.active = true;
    }

    this.spawnUnit = function () {
        //let localGroups = mapCellGrid[cell[0],cell[1]];
        //find all unit groups in surrounding cells
        if (!this.groupToSpawnTo || this.groupToSpawnTo.position != position) {
            this.groupToSpawnTo = new unitGroup(team, 1, position, currentUnit, null, 1, defaultMoveSpeed);
            unitGroups.push(groupToSpawnTo);
        } else {
        this.groupToSpawnTo.incrementSize();
        }
    }

    this.team = team;
    this.size = size;
    this.position = position;
    this.cell = [Math.floor(position.x/5),Math.floor(position.y/5)]
    this.possibleUnits = possibleUnits;
    this.currentUnit = possibleUnits[0];
    this.active = false;
    this.upgradeLevel = upgradeLevel;

}


//initialize the game canvas; runs on page load
function initializeCanvasContext() {
    mapCanvas = document.getElementById("mapCanvas");
    uiCanvas = document.getElementById("uiCanvas");
    mapColorCanvas = document.getElementById("mapColorCanvas");
    spriteCanvas = document.getElementById("spriteCanvas");
    if (!spriteCanvas || !mapColorCanvas || !uiCanvas || !mapCanvas) {
        console.log("failed to grab a canvas, trying again in 1000ms");
        setTimeout(initializeCanvasContext(), 1000);
    } else {
        console.log("successfully grabbed every canvas, initializing context");
        spriteContext = spriteCanvas.getContext("2d");
        console.info(spriteContext);
        mapColorContext = mapColorCanvas.getContext("2d");
        mapColorContext.globalAlpha = 0.3;
        console.info(mapColorContext);
        uiContext = uiCanvas.getContext("2d");
        console.info(uiContext);
        mapContext = mapCanvas.getContext("2d");
        console.info(mapContext);
    }
}

//this is the function that gets looped for the game to function
//most of the top level functions inside here should be self explanatory
function gameLoopFunction() {
    spawnUnits();
    moveUnits();
    unitsFight(); //nearby hostile units will kill each other and be removed from the game
    if (captureSpawners()) { //captureSpawners() will return true if any were captured, triggering a check to see if the game is over
        if (checkGameEnd()) {
            endGame();
        }
    }
}

function drawLoop() {
    drawUnits();
    drawSpawners();
    drawOverlay();
}

function spawnUnits() {

    return;
}

function onStartup() {

}

function canvasSetup() {
    mapContext.fillStyle = colors.MAP_GREEN;
    mapContext.fillRect(0,0, canvasSize[0], canvasSize[1]);

}

function getMap() {
    let currentMap = {spawners: [],type: mapTypes.PLAIN};
    return currentMap;
}

function drawProgressBar() {
    let totalLength = 600;
    let totalStrength = 0;
    let teamStrengths = [];
    for (teamObject of teams) {
        teamStrengths[teamStrengths.length] = teamObject.strength;
        totalStrength += teamObject.strength;    
    }
    let bars = [];
    for (team of teamStrengths) {
        bars.push(team/totalStrength*totalLength);
    }
    for (let i = 0; i < bars.length; i++) {
        console.info("drawing rectangle of color: "+ teams[i].color + " and coords: "+parseInt(200+sumTo(bars,i))+", "+ 650 +", "+ bars[i]+", "+ 50);
        uiContext.fillStyle = teams[i].color;
        uiContext.fillRect(200+sumTo(bars,i), 650, bars[i], 50);
    }
    
}

function sumTo(arrayIn = [], arrayPos = 0) {
    let sum = 0;
    if (arrayPos > arrayIn.length ) {
        arrayPos = arrayIn.length;
    }
    for (let i = 0; i < arrayPos; i++) {
        sum += arrayIn[i];
    }
    return sum;
}

function drawUnits() {
    for (unitGroup of unitGroups) {

    }
}

function drawUnitSprite(position, size) {
    drawTriangle(size*2);
}

function drawRandomTriangles(numberOfTriangles) {
    for (let i = 0; i < numberOfTriangles; i++) {
        let color = generateRandomColor();
        drawTriangle(Math.floor(Math.random()*40)+10, {x:Math.floor(Math.random()*1000) , y:Math.floor(Math.random()*750)}, spriteContext, color);
    }
}

function drawTriangle(sideLength, pos, ctx, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    let point = findPointAtAngle(sideLength, 300);
    point[0] += pos.x;
    point[1] *= (-1);
    point[1] += pos.y;
    ctx.lineTo(point[0], point[1]);
    ctx.lineTo(point[0]-sideLength, point[1]);
    //console.info(ctx);
    //console.log("attempting to draw triangle with the points: "+ pos.x + ", " + pos.y+ "; " + point[0] + ", " + point[1] + "; " + (point[0]-sideLength) + ", " + point[1]);
    ctx.closePath();
    ctx.fill();
}




//idk why im maing these manually and not just using a library tbh
function Vector2(x = 1, y = 1) {
    this.updateSelf = function() {
        this.list = [this.x, this.y];
        this.magnitude = vectorMagnitude(this.list);
        let unitVector = makeUnitVector([this.x, this.y]);
        this.unitx = unitVector[0];
        this.unity = unitVector[1];
        this.unitList = [unitVector[0], unitVector[1]];
    }

    this.unit = function () {
        return new Vector2(this.unitx, this.unity);
    }

    //add another vector to the current one
    this.add = function (vector = new Vector2(1,1)) {
        this.x += vector.x;
        this.y += vector.y;
        this.updateSelf();
        return this;
    }

    this.sub = function (vector = new Vector2(1,1)) {
        this.x -= vector.x;
        this.y -= vector.y;
        this.updateSelf();
        return
    }

    //returns optionally negative version of the current vector
    this.returnCopy = function (isNeg = false) {
        if (!isNeg) {
            let copy = new Vector2(this.x, this.y);     
        } else {
            let copy = new Vector2(-this.x, -this.y);
        }
        return copy;
    }

    //checks if the given vector is within the given radius
    this.isWithin = function (radius = .5, position = new Vector2(1,1)) {
        let bool;
        position.sub(this);
        if (position.magnitude > -radius && position.magnitude < radius) {
            bool = true;
        } else {
            bool = false;
        }
        return bool;
    }

    this.x = x;
    this.y = y;
    this.updateSelf();
}

function findPointAtAngle(length, angle) {
    let newPoint = [0,0];
    newPoint[0] = length*Math.cos(angle*Math.PI/180);
    newPoint[1] = length*Math.sin(angle*Math.PI/180);
    return [newPoint[0],newPoint[1]];
}

function sqr(x) {
    return Math.pow(x,2);
}

function vectorMagnitude(vectorIn = [2, 2]) {
    return Math.sqrt(sqr(vectorIn[0])+sqr(vectorIn[1]));
}

function makeUnitVector(vectorIn = [2, 2]) {
    let vm = vectorMagnitude(vectorIn);
    return [vectorIn[0]/vm, vectorIn[1]/vm];
}

function findDigits(number, x = 1) {
    if (number >= 10) {
        number /= 10;
        return findDigits(number, x+1);
    } else {
        return x;
    }
}

function generateRandomColor() {
    let colorString = "#"
    let RGB = [0,0,0];
    for (color of RGB) {
        color = Math.floor(Math.random()*200)+56;
        color = color.toString(16);
        if (color.length == 1) {
            color = "0" + color;
        }
        colorString = colorString + color;
    }
    return colorString;

}