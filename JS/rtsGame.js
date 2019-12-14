var mainGameCanvas;
var mainGameCanvasContext;
var overlayCanvas;
var overlayCanvasContext;
var gameLoop;
var spawners = [];
var mapSize = [100, 75];
var teams = [];
var unitGroups = [];

function unitGroupConstructor(team = 0, size = 10, position = new Vector2(10, 10), movingTo = {coords: new Vector2(10, 10), currentlyMoving:false}, speed = 1) {
    self.team = team;
    self.size = size;
    self.position = position;
    self.movingTo = movingTo;
    self.movementSpeed = speed;
    function incrementSize() {
        self.size++;
    }
    function changeSize(amt = -5) {
        self.size += amt;
    }
    function setDestination(dest = new Vector2(10,10)) {
        self.movingTo.coords = dest
        self.movingTo.currentlyMoving = true;
    }
    function updatePos() {
        self.position[0] += destinationUnitVector[0]*speed;
        self.position[1] += destinationUnitVector[1]*speed;
    }

}

function spawnerConstructor() {

}


//initialize the game canvas; runs on page load
function initializeCanvasContext() {
    mainGameCanvas = document.getElementById("mainGame");
    if (!mainGameCanvas) {
        console.log("failed to grab canvas, trying again in 200ms");
        setTimeout(initializeCanvasContext(), 200);
    } else {
        console.log("successfully grabbed canvas, initializing context");
        mainGameCanvasContext = mainGameCanvas.getContext("2d");
        console.info(mainGameCanvasContext)
    }
    overlayCanvas = document.getElementById("");
    
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
    self.x = x;
    self.y = y;
    self.updateSelf()

    function updateSelf() {
        self.list = [x, y]
        let unitVector = makeUnitVector([x, y]);
        self.unitx = unitVector[0];
        self.unity = unitVector[1];
        self.unitList = [unitx, unity];
    }

    function add(vector = new Vector2(1,1)) {
        self.x += vector.x;
        self.y += vector.y;
        self.updateSelf();
    }
}

function sqr(x) {
    return Math.pow(x,2);
}

function vectorMagnitude(vectorIn = [2, 2]) {
    return Math.sqrt(sqr(a)+sqr(b));
}

function makeUnitVector(vectorIn = [2, 2]) {
    let vm = vectorMagnitude(vectorIn);
    return [vectorIn[0]/vm, vectorIn[1]/vm];
}