var mapCanvas;
var mapContext;
var spriteCanvas;
var spriteContext;
var persSpriteCanvas;
var persSpriteContext;
var mapColorCanvas;
var mapColorContext;
var overlayCanvas1;
var overlayContext1;
var uiCanvas;
var uiContext;
var gameContainer;
var canvasSize = [];
var c_top;
var c_left;
var c_bottom;
var c_right;
var mousePos;
var selectingUnit = false;
var selectionBox = [];
var movingSelected = false;
var gameLoopVar;
var drawLoopVar;
var spawners = [];
var mapSize = [100, 75];
var teams = [];
var unitGroups = [];
var groupGroups = [];
var selectedUnits = [];
var defaultMoveSpeed = .25;
var gameActive = false;
var paused = false;
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


function setUpListeners() {
    gameContainer = document.getElementById("gameContainer");
    window.addEventListener("keydown", pauseGameListener);
    gameContainer.addEventListener("mousedown", clickListener);
    gameContainer.addEventListener("contextmenu", disableContext);
    gameContainer.addEventListener("mousemove", mouseMoveListener)
    console.log("finished adding event listeners");
}   

function pauseGameListener(e) {
    if (e.key == "p") {
        console.log("the p key was pressed, toggling pause o%s", paused? "ff": "n");
        paused = !paused;
    }
}

function clickListener(e) {
    e.preventDefault();
    //e.preventPropagation();
    let clickInfo = {x: e.x - c_left, y: e.y - c_top};
    switch(e.button) {
        case 0:
            leftClick(clickInfo);
        return;
        case 2:
            rightClick(clickInfo);
        return;
    }
}

function mouseMoveListener(e) {
    mousePos = [e.x - c_left, e.y - c_top];
}

function disableContext(e) {
    e.preventDefault();
}

//constructor for a group of units
function UnitGroup(id, team = 1, size = 10, position = new Vector2(10, 10), unitType = unitTypes.SWORD,spawner = null, movingTo = {coords: new Vector2(0, 0), movementDirection: new Vector2(0,0), currentlyMoving:false}, radius = 2, speed = defaultMoveSpeed) {
    this.incrementSize = function () {
        this.size++;
        this.radius = findDigits(this.size);
        return true;
    }
    this.changeSize = function (amt = -5) {
        this.size += amt;
        this.radius = findDigits(this.size);
    }
    this.setDestination = function (dest = new Vector2(10,10)) {
        if (this.position.isSimilar(dest) || this.movingTo.coords.isSimilar(dest)) {
            console.log("new destination is too close to the old one, aborting move command");
            return;
        }
        console.log("setting destination of unit %d to %d, %d", this.id, dest.x, dest.y);
        this.movingTo.coords = dest.returnCopy();
        this.movingTo.movementDirection = dest.returnCopy().sub(this.position);
        this.movingTo.unit = this.movingTo.movementDirection.unit()
        this.movingTo.currentlyMoving = true;
        this.movingTo.distanceTo = this.movingTo.movementDirection.magnitude;
        if (this.spawner) {
            this.spawner.groupToSpawnTo = null;
        }
        this.spawner = null;
    }
    this.updatePos = function () {
        let dtt = this.movingTo.unit.multCopy(new Vector2(this.movementSpeed,this.movementSpeed));
        if (this.movingTo.distanceTo < dtt.magnitude) {
            this.position.add(this.movingTo.unit.multCopy(new Vector2(this.movingTo.distanceTo,this.movingTo.distanceTo)));
            this.movingTo.currentlyMoving = false;
        } else {
            this.position.add(dtt);
        }
        this.updateDistance();
        //checks if a cell line was crossed and updates relevant locations
        if (this.currentCell != [Math.floor(position.x/5), Math.floor(position.y/5)]) {
            let ti = 0;
            for (let i = 0; i < mapCellGrid[this.currentCell[0]][this.currentCell[1]].length ; i++) {
                if (mapCellGrid[this.currentCell[0]][this.currentCell[1]][i] == this.id) {
                    mapCellGrid[this.currentCell[0]][this.currentCell[1]].splice(i, 1);
                }
            }
            this.currentCell = [Math.floor(position.x/5), Math.floor(position.y/5)];
            mapCellGrid[this.currentCell[0]][this.currentCell[1]].push(this.id);   
        }
    }

    this.updateDistance = function () {
        this.movingTo.movementDirection = this.movingTo.coords.returnCopy().sub(this.position);
        this.movingTo.distanceTo = this.movingTo.movementDirection.magnitude;
    }

    if (!movingTo) {
        movingTo = {coords: new Vector2(0,0), movementDirection: new Vector2(0,0), currentlyMoving: false};
    }
    this.id = id;
    this.spawner = spawner;
    this.team = team;
    this.size = size;
    this.position = position;
    this.unitType = unitType;
    this.movingTo = movingTo;
    this.movementSpeed = speed;
    //radius is also used as a size metric for visualizing groups, and increments at every power of ten
    this.radius = radius;
    this.currentCell = [Math.floor(position.x/5), Math.floor(position.y/5)];
    mapCellGrid[this.currentCell[0]][this.currentCell[1]].push(this.id);
}

//constructor for a group of unit groups of different types
function GroupGroup(team = 1, size = 2, position = new Vector2(10,10), movingTo = {coords: new Vector2(10, 10), currentlyMoving:false}, speed = defaultMoveSpeed/2) {

}

function Team(name = "neutral", number = 0, color = colors.TEAM_WHITE) {

    this.changeUnits = function (amt) {
        this.units += amt;
        this.strength += amt;
    }

    this.changeSpawners = function (amt) {
        this.spawners += amt;
        this.strength += amt*10;
    }

    this.spawners = 1;
    this.units = 0;
    this.name = name;
    this.number = number;
    this.strength = 10;
    this.color = color;
}

function Spawner(team = 1, size = 1, position = new Vector2(20,20), upgradeLevel = 0, currentUnit = unitTypes.SWORD, possibleUnits = [unitTypes.SWORD]) {
    this.changeTeam = function (newTeam) {
        if (this.team == 1) {
            this.activate();
        }
        teams[this.team].changeSpawners(-1);
        this.team = newTeam;
        this.health = 10;
        teams[this.team].changeSpawners(1);
        drawSpawners();
    }

    this.heal = function() {
        if (this.health >= this.maxHealth) {
            return;
        }
        this.health += 1;
    }

    this.activate = function () {
        this.active = true;
    }

    this.spawnUnit = function () {
        //let localGroups = mapCellGrid[cell[0],cell[1]];
        //find all unit groups in surrounding cells
        if (!this.active) {
            return;
        }
        teams[this.team].changeUnits(1);
        if (this.groupToSpawnTo && this.groupToSpawnTo.incrementSize()) {
            return;
        }
        //console.info(this.groupToSpawnTo);
        if (this.groupToSpawnTo) {
        //console.log("spawning unit at location: "+this.position.list+". compare lists: "+this.groupToSpawnTo.position.returnList() +" --- "+ this.position.returnList())
        }
        if (this.groupToSpawnTo == null/* || this.groupToSpawnTo.position.returnList() != this.position.returnList()*/) {
            this.groupToSpawnTo = new UnitGroup(unitGroups.length, this.team, 1, this.position.returnCopy(), this.currentUnit, this, null, 1, defaultMoveSpeed);
            unitGroups.push(this.groupToSpawnTo);
        }
    }

    this.takeDamage = function (dmg, team) {
        this.health -= dmg;
        if (this.health <= 0) {
            this.changeTeam(team);
            return true;
        }
        else{
            return false;
        }
    }
    
    this.health = size*50;
    this.maxHealth = size*50;
    this.groupToSpawnTo;
    this.team = team;
    this.size = size;
    this.position = position;
    this.cell = [Math.floor(position.x/5),Math.floor(position.y/5)]
    this.possibleUnits = possibleUnits;
    this.currentUnit = possibleUnits[0];
    this.active = team == 1 ? false : true;
    this.upgradeLevel = upgradeLevel;

}






//this section is a bunch of initialization functions, including the actual activation functions that the user uses buttons to run

function startButtonPressed() {
    if (gameActive) {
        return;
    }
    teams[0] = new Team("player", 0, colors.TEAM_PURPLE);
    teams[1] = new Team("neutral", 1);
    teams[2] = new Team("enemy1", 2, colors.TEAM_RED);
    let map = getMap(cellSize);
    mapSetup(map.type);
    spawners = map.spawners;
    teams[1].changeSpawners(spawners.length-teams.length+1);
    drawSpawners();
    drawLoopVar = setInterval(drawLoop, 50);
    gameLoopVar = setInterval(gameLoopFunction, 250);
    gameActive = true;
}

function resetButtonPressed() {
    gameActive = false;
    clearInterval(drawLoopVar);
    clearInterval(gameLoopVar);
    spawners = [];
    teams = [];
    unitGroups = [];
    teams[0] = new Team("player", 0, colors.TEAM_PURPLE);
    teams[1] = new Team("neutral", 1);
    teams[2] = new Team("enemy1", 2, colors.TEAM_RED);
    var mapCellGrid = [];
    for (let i = 0; i < mapSize[0]/5; i++) {
        mapCellGrid[i] = [];
        for (let f = 0; f < mapSize[1]/5; f++) {
            mapCellGrid[i][f] = [];
        }
    }
    var cellSize = [mapCellGrid.length, mapCellGrid[0].length];
    let map = getMap(cellSize);
    mapSetup(map.type);
    spawners = map.spawners;
    teams[1].changeSpawners(spawners.length-teams.length+1);
    drawLoopVar = setInterval(drawLoop, 100);
    gameLoopVar = setInterval(gameLoopFunction, 500);
    persSpriteContext.clearRect(0,0,1000,750);
    drawSpawners();
    gameActive = true; 
}

function getPageSizeAndCoords() {
    let rect = gameContainer.getBoundingClientRect();
    console.info(rect);
    canvasSize = [rect.width, rect.height];
    c_top = rect.top;
    c_left = rect.left;
    c_right = rect.right;
    c_bottom = rect.bottom; 
}

//initialize the game canvas; runs on page load
function initializeCanvasContext() {
    mapCanvas = document.getElementById("mapCanvas");
    uiCanvas = document.getElementById("uiCanvas");
    mapColorCanvas = document.getElementById("mapColorCanvas");
    spriteCanvas = document.getElementById("spriteCanvas");
    overlayCanvas1 = document.getElementById("overlayCanvas1");
    persSpriteCanvas = document.getElementById("persSpriteCanvas");
    if (!spriteCanvas || !mapColorCanvas || !uiCanvas || !mapCanvas) {
        console.log("failed to grab a canvas, trying again in 1000ms");
        setTimeout(initializeCanvasContext(), 1000);
    } else {
        //console.log("successfully grabbed every canvas, initializing context");
        spriteContext = spriteCanvas.getContext("2d");
        //console.info(spriteContext);
        mapColorContext = mapColorCanvas.getContext("2d");
        mapColorContext.globalAlpha = 0.3;
        //console.info(mapColorContext);
        uiContext = uiCanvas.getContext("2d");
        //console.info(uiContext);
        mapContext = mapCanvas.getContext("2d");
        //console.info(mapContext);
        overlayContext1 = overlayCanvas1.getContext("2d");
        //console.info(overLayContext1);
        persSpriteContext = persSpriteCanvas.getContext("2d");
        console.info(mapContext, mapColorContext, spriteContext, overlayContext1, uiContext, persSpriteContext);
    }
}

//this will be used to generate a map, but for now its just a green backdrop
function mapSetup(mapType) {
    mapContext.fillStyle = colors.MAP_GREEN;
    mapContext.fillRect(0,0, canvasSize[0], canvasSize[1]);

}

//this generates the gameplay portion of the map, actually placing the spawners in the correct spots
function getMap(csl) {
    let currentMap = {spawners: generateSpawners(csl),type: mapTypes.PLAIN};
    return currentMap;
}

function generateSpawners(ms) {
    let spawnerList = [];
    spawnerList[0] = new Spawner(0, 1, new Vector2(5,5));
    spawnerList[1] = new Spawner(2, 1, new Vector2(90, 70));
    for (let i = 0; i < 8; i++) {
        spawnerList.push(new Spawner(1, 1, new Vector2(Math.floor(Math.random()*70)+10, Math.floor(Math.random()*50)+10)));
    }
    return spawnerList;
}







//this is the function that gets looped for the game to function
//most of the top level functions inside here should be self explanatory
function gameLoopFunction() {
    if (paused) {
        return;
    }
    spawnUnits();
    moveUnits();
    //unitsCombine();
    //unitsPush();
    unitsFight(); //nearby hostile units will kill each other and be removed from the game
    /*if (captureSpawners()) { //captureSpawners() will return true if any were captured, triggering a check to see if the game is over
        if (checkGameEnd()) {
            endGame();
        }
    }*/
    captureSpawners();
}

function captureSpawners() {
    let wereCap = false;
    for (unit of unitGroups) {
        for (spawner of spawners) {
            if (unit.position.isWithin(3,spawner.position) && unit.team != spawner.team) {
                let dmgDealt = Math.ceil(unit.size*.2)
                if (spawner.takeDamage(dmgDealt, unit.team)) {
                    wereCap = true;
                }
                unit.changeSize(-dmgDealt);
            }
        }
    }
    return wereCap;
}

function moveUnits() {
    for (unit of unitGroups) {
        if (unit.movingTo.currentlyMoving) {
            unit.updatePos();
        }
    }
}

//this isnt in the main loop function because physics shouldnt be reliant on fps
function drawLoop() {
    spriteContext.clearRect(0,0,1000,750);
    drawUnits();
    uiContext.clearRect(0,0,1000,750);
    drawOverlay();

}

function unitsFight() {
    //for () {

    //}
}

function drawOverlay() {
    drawProgressBar();
    if (selectingUnit) {
        drawSelectionBox();
    }
}

function drawSelectionBox() {
    overlayContext1.clearRect(0,0,1000,750);
    overlayContext1.strokeStyle = "#EEEEEE";
    overlayContext1.lineWidth = 5;
    //console.log("drawing selection box at %d, %d, with width %d and height %d", selectionBox[0].x, selectionBox[0].y, mousePos[0]-selectionBox[0].x, mousePos[1]-selectionBox[0].y);
    overlayContext1.strokeRect(selectionBox[0].x, selectionBox[0].y, mousePos[0]-selectionBox[0].x, mousePos[1]-selectionBox[0].y);
}

function spawnUnits() {
    for (spawner of spawners) {
        spawner.spawnUnit();
    }
    return; //consistency is for squares
}

function unitsPush() {

}

function damageSpawner(u, s) {
    let dmg = Math.max(u.size/2+5, s.health);
    s.takeDamage(dmg,u.team);
    u.changeSize(-dmg);
}

function leftClick(io) {
    if (movingSelected) {
        moveSelected();
        movingSelected = !movingSelected;
        return;
    }
    selectingUnit = !selectingUnit;
    if (selectingUnit) {
        console.log("drawing selection box, first corner is at %d, %d", io.x, io.y);
        selectionBox[0] = new Vector2(io.x, io.y);
    } else {
        console.log("finishing selection, second corner is at %d, %d", io.x, io.y);
        selectionBox[1] = new Vector2(io.x, io.y);
        overlayContext1.clearRect(0,0,1000,750);
        movingSelected = selectUnits(selectionBox);
    }
}

function rightClick(io) {

}

function moveSelected() {
    for (let i = 0; i < selectedUnits.length; i++) {
        unitGroups[selectedUnits[i]].setDestination(new Vector2(mousePos[0]/10, mousePos[1]/10))
    }
}

function selectUnits(box) {
    console.log("finding selected units");
    let tl = new Vector2(Math.min(box[0].x, box[1].x),Math.min(box[0].y, box[1].y));
    let br = new Vector2(Math.max(box[0].x, box[1].x),Math.max(box[0].y, box[1].y));
    console.log("selection box is %o, %o", tl, br);
    //let mp = tl.midPoint(br);
    let sc = [Math.floor(tl.x/50),Math.floor(tl.y/50)];
    let ec = [Math.floor(br.x/50),Math.floor(br.y/50)];    
    console.log("selected cells range from %d, %d to %d, %d", sc[0], sc[1], ec[0], ec[1]);
    selectedUnits = [];
    for (let i = sc[0]; i < ec[0]; i++) {
        for (let f = sc[1]; f < ec[1]; f++) {
            for (unitID of mapCellGrid[i][f]) {
                if (unitGroups[unitID].team == 0) {
                    selectedUnits.push(unitID);
                }
            }
        }
    }
    for (let i = 0; i < selectedUnits.length; i++) {
        let up = unitGroups[selectedUnits[i]].position;
        if (up.x < tl.x/10 || up.x > br.x/10 || up.y < tl.y/10 || up.y > br.y/10) {
            selectedUnits.splice(i,1);
        }
    }
    console.log("selected units are", selectedUnits);
    return selectedUnits.length == 0 ? false : true;
}

function drawSpawners() {
    for (spawner of spawners) {
        persSpriteContext.fillStyle = teams[spawner.team].color;
        persSpriteContext.fillRect(spawner.position.x*10-5, spawner.position.y*10-20,spawner.size*10,spawner.size*10);
    }
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
        //console.info("drawing rectangle of color: "+ teams[i].color + " and coords: "+parseInt(200+sumTo(bars,i))+", "+ 650 +", "+ bars[i]+", "+ 50);
        uiContext.fillStyle = teams[i].color;
        uiContext.fillRect(200+sumTo(bars,i), 10, bars[i], 50);
    }
    
}

//runs drawUnitSprite for every unit in the list, while also parsing the amount of triangles to draw
function drawUnits() {
    for (unit of unitGroups) {
        let uss = ""+unit.size; //yes this is faster to run than unit.size.toString()
        drawUnitSprite(unit.position.returnCopy(), uss[0], uss, unit.radius, teams[unit.team].color);
    }
}

//draws a sprite for a unit, drawing 1-9 triangles of the given size to indicate how many of the highest order of unit are in the group
//for example, a group with a strength of 1-9 is just the smallest triangle that many times, but then the bigger size only gets a new triangle every 10 strength
function drawUnitSprite(position, amount, stw, radius, color) {
    let sd = radius*5+5;
    position.mult(new Vector2(10,10)).floor();
    let fontSize = sd;
    spriteContext.font = sd+"px Arial";
    let form;
    let textPos;
    switch(amount) {
        case "1":
            form = [1];
            textPos = position.returnCopy();
            position.add(new Vector2(0,-(0.5*sd*form.length)));
            spriteContext.strokeRect(position.x-(sd*0.5*form[0])-1,position.y-2, sd*form[0]+2, sd*form.length+2);
            for (let i = 0; i < form.length; i++) {
                for (let f = 0; f < form[i]; f++) {
                    drawTriangle(sd, position.addCopy(new Vector2(-(sd*(0.5*(form[i]-1)))+sd*f,0)), spriteContext, color);
                }
                position.add(new Vector2(0,sd));
            }
            spriteContext.fillStyle = "#000000";
            spriteContext.fillText(stw,textPos.x-(spriteContext.measureText(stw).width/2),textPos.y+(fontSize/2)-2);
            break;
        case "2":
            form = [2];
            textPos = position.returnCopy();
            position.add(new Vector2(0,-(0.5*sd*form.length)));
            spriteContext.strokeRect(position.x-(sd*0.5*form[0])-1,position.y-2, sd*form[0]+2, sd*form.length+2);
            for (let i = 0; i < form.length; i++) {
                for (let f = 0; f < form[i]; f++) {
                    drawTriangle(sd, position.addCopy(new Vector2(-(sd*(0.5*(form[i]-1)))+sd*f,0)), spriteContext, color);
                }
                position.add(new Vector2(0,sd));
            }
            spriteContext.fillStyle = "#000000";
            spriteContext.fillText(stw,textPos.x-(spriteContext.measureText(stw).width/2),textPos.y+(fontSize/2)-2);
            break;
        case "3":
            form = [2,1];
            textPos = position.returnCopy();
            position.add(new Vector2(0,-(0.5*sd*form.length)));
            spriteContext.strokeRect(position.x-(sd*0.5*form[0])-1,position.y-2, sd*form[0]+2, sd*form.length+2);
            for (let i = 0; i < form.length; i++) {
                for (let f = 0; f < form[i]; f++) {
                    drawTriangle(sd, position.addCopy(new Vector2(-(sd*(0.5*(form[i]-1)))+sd*f,0)), spriteContext, color);
                }
                position.add(new Vector2(0,sd));
            }
            spriteContext.fillStyle = "#000000";
            spriteContext.fillText(stw,textPos.x-(spriteContext.measureText(stw).width/2),textPos.y+(fontSize/2)-2);
            break;
        case "4":
            form = [2,2];
            textPos = position.returnCopy();
            position.add(new Vector2(0,-(0.5*sd*form.length)));
            spriteContext.strokeRect(position.x-(sd*0.5*form[0])-1,position.y-2, sd*form[0]+2, sd*form.length+2);
            for (let i = 0; i < form.length; i++) {
                for (let f = 0; f < form[i]; f++) {
                    drawTriangle(sd, position.addCopy(new Vector2(-(sd*(0.5*(form[i]-1)))+sd*f,0)), spriteContext, color);
                }
                position.add(new Vector2(0,sd));
            }
            spriteContext.fillStyle = "#000000";
            spriteContext.fillText(stw,textPos.x-(spriteContext.measureText(stw).width/2),textPos.y+(fontSize/2)-2);
            break;
        case "5":
            form = [2,3];
            textPos = position.returnCopy();
            position.add(new Vector2(0,-(0.5*sd*form.length)));
            spriteContext.strokeRect(position.x-(sd*0.5*form[1])-1,position.y-2, sd*form[1]+2, sd*form.length+2);
            for (let i = 0; i < form.length; i++) {
                for (let f = 0; f < form[i]; f++) {
                    drawTriangle(sd, position.addCopy(new Vector2(-(sd*(0.5*(form[i]-1)))+sd*f,0)), spriteContext, color);
                }
                position.add(new Vector2(0,sd));
            }
            spriteContext.fillStyle = "#000000";
            spriteContext.fillText(stw,textPos.x-(spriteContext.measureText(stw).width/2),textPos.y+(fontSize/2)-2);
            break;
        case "6":
            form = [3,3];
            textPos = position.returnCopy();
            position.add(new Vector2(0,-(0.5*sd*form.length)));
            spriteContext.strokeRect(position.x-(sd*0.5*form[0])-1,position.y-2, sd*form[0]+2, sd*form.length+2);
            for (let i = 0; i < form.length; i++) {
                for (let f = 0; f < form[i]; f++) {
                    drawTriangle(sd, position.addCopy(new Vector2(-(sd*(0.5*(form[i]-1)))+sd*f,0)), spriteContext, color);
                }
                position.add(new Vector2(0,sd));
            }
            spriteContext.fillStyle = "#000000";
            spriteContext.fillText(stw,textPos.x-(spriteContext.measureText(stw).width/2),textPos.y+(fontSize/2)-2);
            break;
        case "7":
            form = [3,3,1];
            textPos = position.returnCopy();
            position.add(new Vector2(0,-(0.5*sd*form.length)));
            spriteContext.strokeRect(position.x-(sd*0.5*form[0])-1,position.y-2, sd*form[0]+2, sd*form.length+2);
            for (let i = 0; i < form.length; i++) {
                for (let f = 0; f < form[i]; f++) {
                    drawTriangle(sd, position.addCopy(new Vector2(-(sd*(0.5*(form[i]-1)))+sd*f,0)), spriteContext, color);
                }
                position.add(new Vector2(0,sd));
            }
            spriteContext.fillStyle = "#000000";
            spriteContext.fillText(stw,textPos.x-(spriteContext.measureText(stw).width/2),textPos.y+(fontSize/2)-2);
            break;
        case "8":
            form = [3,3,2];
            textPos = position.returnCopy();
            position.add(new Vector2(0,-(0.5*sd*form.length)));
            spriteContext.strokeRect(position.x-(sd*0.5*form[0])-1,position.y-2, sd*form[0]+2, sd*form.length+2);
            for (let i = 0; i < form.length; i++) {
                for (let f = 0; f < form[i]; f++) {
                    drawTriangle(sd, position.addCopy(new Vector2(-(sd*(0.5*(form[i]-1)))+sd*f,0)), spriteContext, color);
                }
                position.add(new Vector2(0,sd));
            }
            spriteContext.fillStyle = "#000000";
            spriteContext.fillText(stw,textPos.x-(spriteContext.measureText(stw).width/2),textPos.y+(fontSize/2)-2);
            break;
        case "9":
            form = [3,3,3];
            textPos = position.returnCopy();
            position.add(new Vector2(0,-(0.5*sd*form.length)));
            spriteContext.strokeRect(position.x-(sd*0.5*form[0])-1,position.y-2, sd*form[0]+2, sd*form.length+2);
            for (let i = 0; i < form.length; i++) {
                for (let f = 0; f < form[i]; f++) {
                    drawTriangle(sd, position.addCopy(new Vector2(-(sd*(0.5*(form[i]-1)))+sd*f,0)), spriteContext, color);
                }
                position.add(new Vector2(0,sd));
            }
            spriteContext.fillStyle = "#000000";
            spriteContext.fillText(stw,textPos.x-(spriteContext.measureText(stw).width/2),textPos.y+(fontSize/2)-2);
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

    this.isSimilar = function (vector2) {
        if (Math.abs(this.x-vector2.x+this.y-vector2.y) < .005) {
            return true;
        }
        return false;
    }

    this.floor = function() {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        this.updateSelf();
        return this;
    }

    this.returnMagnitude = function () {
        return this.magnitude;
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
        let copy = new Vector2(this.x+vector.x, this.y+vector.y);
        //copy.updateSelf();
        return copy;
    }

    this.mult = function (vector) {
        if (this.x && this.y) {
            this.x *= vector.x;
            this.y *= vector.y;
            this.updateSelf();
        } else {
            return this.mult(new Vector2(vector,vector));
        }
        return this;
    }

    this.multCopy = function (vector = new Vector2(1,1)) {
        let copy = new Vector2(vector.x * this.x, vector.y* this.y);
        return copy;
    }

    this.sub = function (vector = new Vector2(1,1)) {
        this.x -= vector.x;
        this.y -= vector.y;
        this.updateSelf();
        return this;
    }

    this.midPoint = function (vector) {
        return new Vector2((this.x+vector.x)/2,(this.y+vector.y)/2);
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

    this.returnList = function () {
        return this.list;
    }

    this.changeLength = function (newLength = 1) {
        let uv = this.unit();
        uv.mult(newLength);
        this.x = uv.x;
        this.y = uv.y;
        this.updateSelf();
        return this;
    }

    //checks if the given vector is within the given radius
    this.isWithin = function (radius = .5, position = new Vector2(1,1)) {
        position = position.returnCopy();
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