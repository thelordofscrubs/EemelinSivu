var gameTick = 10;
var baseHealth = 1000;





function gameLoop() {
    Move();
    Attack();
    Die();
    //check if game over
    if(baseHealth <= 0) {

    }
}