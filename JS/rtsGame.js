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
    mapCellGrid[this.currentCell[0]][this.currentCell[1]].push(this)
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
            unitGroups.push(this.groupToSpawnTo);
        } else {
        this.groupToSpawnTo.incrementSize();
        }
    }

    this.groupToSpawnTo;
    this.team = team;
    this.size = size;
    this.position = position;
    this.cell = [Math.floor(position.x/5),Math.floor(position.y/5)]
    this.possibleUnits = possibleUnits;
    this.currentUnit = possibleUnits[0];
    this.active = false;
    this.upgradeLevel = upgradeLevel;

}




//this section is a bunch of initialization functions, including the actual activation functions that the user uses buttons to run

function startButtonPressed() {

}

function resetButtonPressed() {

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


//this will be used to generate a map, but for now its just a green backdrop
function canvasSetup() {
    mapContext.fillStyle = colors.MAP_GREEN;
    mapContext.fillRect(0,0, canvasSize[0], canvasSize[1]);

}

function onStartup() {

}

//this generates the gameplay portion of the map, actually placing the spawners in the correct spots
function getMap() {
    let currentMap = {spawners: [],type: mapTypes.PLAIN};
    return currentMap;
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

//this isnt in the main loop function because physics shouldnt be reliant on fps

function drawLoop() {
    spriteContext.clearRect(0,0,1000,750);
    drawUnits();
    drawSpawners();
    uiContext.clearRect(0,0,1000,750);
    drawOverlay();
}


function spawnUnits() {
    for (spawner of spawners) {
        spawner.spawnUnit();
    }
    return; //consistency is for programmers still in school
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

function drawUnits() {
    for (unit of unitGroups) {
        amt = (""+unit.size)[0];
        drawUnitSprite(unit.position.returnCopy(), amt, unit.radius, teams[unit.team].color);
    }
}

//draws a sprite for a unit, drawing 1-9 triangles of the given size to indicate how many of the highest order of unit are in the group
//for example, a group with a strength of 1-9 is just the smallest triangle that many times, but then the bigger size only gets a new triangle every 10 strength
function drawUnitSprite(position, amount, radius, color) {
    let sd = radius*5+5;
    position.mult(new Vector2(10,10));
    switch(amount) {
        case "1":
            position.add(new Vector2(0,-(sd/2)));
            drawTriangle(sd, position, spriteContext, color);
            break;
        case "2":
            position.add(new Vector2(0,-(sd/2)));
            for (let i = 0; i < 2; i++) {
                drawTriangle(sd, position.addCopy(new Vector2(-(sd/2)+sd*i,0)), spriteContext, color);
            }
            break;
        case "3":
            position.add(new Vector2(0,-(sd)));
            for (let i = 0; i < 2; i++) {
                drawTriangle(sd, position.addCopy(new Vector2(-(sd/2)+sd*i,0)), spriteContext, color);
            }
            position.add(new Vector2(0,sd));
            drawTriangle(sd, position, spriteContext, color);
            break;

        case "4":
            position.add(new Vector2(0,-(sd)));
            for (let i = 0; i < 2; i++) {
                drawTriangle(sd, position.addCopy(new Vector2(-(sd/2)+sd*i,0)), spriteContext, color);
            }
            position.add(new Vector2(0,sd));
            for (let i = 0; i < 2; i++) {
                drawTriangle(sd, position.addCopy(new Vector2(-(sd/2)+sd*i,0)), spriteContext, color);
            }
            break;

        case "5":
            position.add(new Vector2(0,-(sd)));
            for (let i = 0; i < 2; i++) {
                drawTriangle(sd, position.addCopy(new Vector2(-(sd/2)+sd*i,0)), spriteContext, color);
            }
            position.add(new Vector2(0,sd));
            for (let i = 0; i < 3; i++) {
                drawTriangle(sd, position.addCopy(new Vector2(-(sd)+sd*i,0)), spriteContext, color);
            }
            break;

        case "6":
            position.add(new Vector2(0,-(sd)));
            for (let i = 0; i < 3; i++) {
                drawTriangle(sd, position.addCopy(new Vector2(-(sd)+sd*i,0)), spriteContext, color);
            }
            position.add(new Vector2(0,sd));
            for (let i = 0; i < 3; i++) {
                drawTriangle(sd, position.addCopy(new Vector2(-(sd)+sd*i,0)), spriteContext, color);
            }
            break;

        case "7":
            position.add(new Vector2(0,-(sd)));
            for (let i = 0; i < 3; i++) {
                drawTriangle(sd, position.addCopy(new Vector2(-(sd)+sd*i,0)), spriteContext, color);
            }
            position.add(new Vector2(0,sd));
            for (let i = 0; i < 4; i++) {
                drawTriangle(sd, position.addCopy(new Vector2(-(sd*1.5)+sd*i,0)), spriteContext, color);
            }
            break;
        case "8":
            position.add(new Vector2(0,-(sd*1.5)));
            for (let i = 0; i < 3; i++) {
                drawTriangle(sd, position.addCopy(new Vector2(-(sd)+sd*i,0)), spriteContext, color);
            }
            position.add(new Vector2(0,sd));
            for (let i = 0; i < 3; i++) {
                drawTriangle(sd, position.addCopy(new Vector2(-(sd)+sd*i,0)), spriteContext, color);
            }
            position.add(new Vector2(0,sd));
            for (let i = 0; i < 2; i++) {
                drawTriangle(sd, position.addCopy(new Vector2(-(sd*0.5)+sd*i,0)), spriteContext, color);
            }
            break;
        case "9":
            position.add(new Vector2(0,-(sd*1.5)));
            for (let i = 0; i < 3; i++) {
                drawTriangle(sd, position.addCopy(new Vector2(-(sd)+sd*i,0)), spriteContext, color);
            }
            position.add(new Vector2(0,sd));
            for (let i = 0; i < 3; i++) {
                drawTriangle(sd, position.addCopy(new Vector2(-(sd)+sd*i,0)), spriteContext, color);
            }
            position.add(new Vector2(0,sd));
            for (let i = 0; i < 3; i++) {
                drawTriangle(sd, position.addCopy(new Vector2(-(sd)+sd*i,0)), spriteContext, color);
            }
            break;
    }
        
}





//this section is random canvas functions used to facilitate drawing stuff i need to draw often

//test function used to draw every unit sprite
function testUnitSpriteDrawFunction() {
    for (let i = 1; i < 10; i++) {
        drawUnitSprite(new Vector2(5+i*6, 30), i, 1, colors.TEAM_PURPLE);
    }
}

//really just a test function to use drawTriangle a bunch with random inputs
function drawRandomTriangles(numberOfTriangles) {
    for (let i = 0; i < numberOfTriangles; i++) {
        let color = generateRandomColor();
        drawTriangle(Math.floor(Math.random()*40)+10, {x:Math.floor(Math.random()*1000) , y:Math.floor(Math.random()*750)}, spriteContext, color);
    }
}

//draws an equilateral triangle with var pos being the tip
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
//these are basic utility/math functions, including a vector2 object used for storing pairs of numbers and their derivatives
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

    this.addCopy = function (vector = new Vector2(1,1)) {
        let copy = this.returnCopy();
        copy.x += vector.x;
        copy.y += vector.y;
        //copy.updateSelf();
        return copy;
    }

    this.mult = function (vector = new Vector2(1,1)) {
        this.x *= vector.x;
        this.y *= vector.y;
        this.updateSelf();
        return this;
    }

    this.sub = function (vector = new Vector2(1,1)) {
        this.x -= vector.x;
        this.y -= vector.y;
        this.updateSelf();
        return this;
    }

    //returns optionally negative version of the current vector
    this.returnCopy = function (isNeg = false) {
        if (!isNeg) {
            return new Vector2(this.x, this.y);     
        } else {
            return new Vector2(-this.x, -this.y);
        }
        return;
    }

    this.changeLength = function (newLength = 1) {
        let uv = this.unit();
        uv.mult(newLength);
        this.x = uv.x;
        this.y = uv.y;
        this.updateSelf();
    }

    //checks if the given vector is within the given radius
    this.isWithin = function (radius = .5, position = new Vector2(1,1)) {
        position.sub(this);
        if (position.magnitude > -radius && position.magnitude < radius) {
            return true;
        } else {
            return false;
        }
    }

    this.x = x;
    this.y = y;
    this.updateSelf();
}

//sums all the numbers in an array up to a specific index
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

//finds the distance in [x,y] format to a point at an angle and distance away
function findPointAtAngle(length, angleInDegrees/*THIS IS IN DEGREES, NOT RADIANS*/) {
    let newPoint = [0,0];
    newPoint[0] = length*Math.cos(angleInDegrees*Math.PI/180);
    newPoint[1] = length*Math.sin(angleInDegrees*Math.PI/180);
    return [newPoint[0],newPoint[1]];
}

//squares a number
//this should be in the native Math object goddamnit
function sqr(x) {
    return Math.pow(x,2);
}

//finds the magnitude of a given vector in [x,y] form
function vectorMagnitude(vectorIn = [2, 2]) {
    return Math.sqrt(sqr(vectorIn[0])+sqr(vectorIn[1]));
}

//returns a unit vector of the given vector in [x,y] form
function makeUnitVector(vectorIn = [2, 2]) {
    let vm = vectorMagnitude(vectorIn);
    return [vectorIn[0]/vm, vectorIn[1]/vm];
}

//finds the amount of digits in a base 10 number
function findDigits(number, x = 1) {
    if (number >= 10) {
        number /= 10;
        return findDigits(number, x+1);
    } else {
        return x;
    }
}

//generates a random color in the form "#012abc" with a floor of "#565656" to force the colors to not be just black
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