var mainGameCanvas
var gameLoop
var spawners = []
var mapSize = [100, 75]



//this is the function that gets looped for the game to function
//most of the top level functions inside here should be self explanatory
function gameLoopFunction() {
    spawnUnits()
    moveUnits()
    unitsFight() //nearby hostile units will kill each other and be removed from the game
    if (captureSpawners()) { //captureSpawners() will return true if any were captured, triggering a check to see if the game is over
        if (checkGameEnd()) {
            endGame()
        }
    }
}