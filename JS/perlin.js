noiseLength = 10000;

function createNoise() {
    let noise = [];
    noise[0] = .5;
    for (let i = 0; i < noiseLength; i++) {
        let chg = Math.random()*.01
        //if (Math.random() < noise[i]) {
        //    chg *= (-1);
        //}
        if (Math.random() <= .5) {
            chg *= (-1);
        }
        //if the number is high, then higher probability for it to go down, same for low but opposite
        if (chg < 0 && noise[i] < .15) {
            if (Math.random() > noise[i]) {
                chg *= (-1);
            }
        }
        if (chg > 0 && noise[i] > .85) {
            if (Math.random() < noise[i]) {
                chg *= (-1);
            }
        }
        noise[i+1] = noise[i] + chg;
    }
    //for(let i = 0; i < noise.length; i++) {
    //    noise[i] -= .5
    //}
    return noise;
}

var noiseArray = createNoise();

function displayNoise(xCord) {
    let x = document.getElementById("canvasDiv");
    x.innerHTML = "<canvas id='canvasElement' width='500' height='500'></canvas>";
    x = document.getElementById("canvasElement");
    let ctx = x.getContext("2d");
    ctx.strokeStyle = "#FFFFFF";
    //ctx.moveTo(0,400);
    //ctx.lineTo(500,400);
    //ctx.stroke();
    ctx.moveTo(0,250);
    for (let i = 0; i < 500; i++) {
        ctx.lineTo(i,250-noiseArray[i+xCord]*100);
        ctx.stroke();
        //ctx.moveTo(i+1,noiseArray[i]*50);
    }
}

//function moveGraph(xCord){
//    let x = document.getElementById 
//}

var pos = 0
window.addEventListener("keydown", direction);
function direction (e) {
    var x = e.keyCode;
    switch(x) {
        case 37:
            if(pos > 0) {
                pos -= 1;
                displayNoise(pos);
            }
            console.log("left");
            break;
            
        case 38:
            console.log("up");
            break;
            
        case 39:
            if(pos < noiseLength) {
                pos += 1;
                displayNoise(pos);
            }
            console.log("right");
            break;
        
        case 40:
            console.log("down");
    }
}
