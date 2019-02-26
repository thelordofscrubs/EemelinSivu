var gameTick = 10;
var baseHealth = 1000;
var Entities = [];
var centerScreen = {x:500,y:1000};

//map is 10000x2000
//canvas is 1000x500

function gameLoop() {
    Move();
    Attack();
    Die();
    Draw();
    //check if game over
    if(baseHealth <= 0) {

    }
}

function detectMouse(e) {
    var x = e.clientX;
    var y = e.clientY;
    

}

function Move() {
    for (var i = 0; i < Entities.length; i++) {
        Entities[i]
    }
}

function Position(x,y) {
    this.xCord = x;
    this.yCord = y;
}

function Velocity(xs,ys) {
    this.xSpeed = xs;
    this.ySpeed = ys;
}

function findDirection(type) {
    if(type==="player") {

    } else {

    }

}

function Entity(h, a, s, as, d, e, xC, yC) {
    this.maxHealth = h;
    this.Attack = a;
    this.Speed = s;
    this.attackSpeed = as;
    this.Defense = d;
    this.maxEnergy = e;
    this.Position(xC,yC);
    this.Velocity(0,0);
    this.direction;
}
