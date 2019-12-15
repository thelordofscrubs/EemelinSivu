var mapCanvas;
var mapContext;
var spriteCanvas;
var spriteContext;
var mapColorCanvas;
var mapColorContext;
var uiCanvas;
var uiContext
var gameLoop;
var spawners = [];
var mapSize = [100, 75];
var teams = [];
var unitGroups = [];
var groupGroups = [];
var defaultMoveSpeed = .05;
const unitTypes = {SWORD: "sword", ARCHER: "archer", MAGE: "mage"};

var mapCellGrid = [];
for (let i = 0; i < mapSize[0]/5; i++) {
    mapCellGrid[i] = [];
    for (let f = 0; f < mapSize[1]/5; f++) {
        mapCellGrid[i][f] = [];
    }
}
var cellSize = [mapCellGrid.length, mapCellGrid[0].length];

//constructor for a group of units
function unitGroup(team = 1, size = 10, position = new Vector2(10, 10), unitType = unitTypes.SWORD, movingTo = {coords: new Vector2(10, 10), movementDirection: new Vector2(0,0), currentlyMoving:false}, radius = 2, speed = defaultMoveSpeed) {
    this.incrementSize = function () {
        this.size++;
        this.radius
    }
    this.changeSize = function (amt = -5) {
        this.size += amt;
    }
    this.setDestination = function (dest = new Vector2(10,10)) {
        this.movingTo.coords = dest;
        this.movingTo.movementDirection = dest.returnCopy().sub(position);
        this.movingTo.currentlyMoving = true;
    }
    this.updatePos = function () {
        this.position.add(this.movingTo.movementDirection.unit*this.movementSpeed);
    }

    this.team = team;
    this.size = size;
    this.position = position;
    this.unitType = unitType;
    this.movingTo = movingTo;
    this.movementSpeed = speed;
    //radius is also used as a size metric for visualizing groups, and increments at every power of ten
    this.radius = radius;
}

//constructor for a group of unit groups of different types
function groupGroup(team = 1, size = 2, position = new Vector2(10,10), movingTo = {coords: new Vector2(10, 10), currentlyMoving:false}, speed = defaultMoveSpeed/2) {

}

function team(name = "neutral", number = 0, strength = 10, color = [255,255,255]) {
    this.changeStrength = function (amt) {
        this.strength += amt;
    }

    this.name = name;
    this.number = number;
    this.strength = strength;
    this.color = color;
}

function spawner(team = 0, size = 1, position = new Vector2(20,20), upgradeLevel = 0,possibleUnits = [unitTypes.SWORD]) {
    this.changeTeam = function (newTeam) {
        this.team = newTeam;
    }

    this.activate = function () {
        this.active = true;
    }

    this.spawnUnit = function () {
        //let localGroups = mapCellGrid[cell[0],cell[1]];
        //find all unit groups in surrounding cells
        let groupToSpawnTo;
        if (localGroups == []) {

        }
        for (group in localGroups) {

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