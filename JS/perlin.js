noiseLength = 10000;

function createNoise(alength) {
    let noise = [];
    //starting point is half
    noise[0] = .5;
    for (let i = 0; i < alength; i++) {
        let chg = Math.random()*.04
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

function twoDNoise(dimL) {
    let yArray = [createNoise(dimL)];
    let t = createNoise(dimL);
    for (let i = 1; i < dimL ; i++) {
        yArray[i] = [];
        yArray[i][0] = t[i];
        for (let f = 1; f < dimL; f++) {
            let OG = (yArray[i][f-1]+yArray[i-1][f])/2;
            let chg = Math.random()*.01
            if (Math.random()<.5) { 
                chg *= (-1);
                if (OG < .1 && Math.random() > OG) {
                    chg *= (-1);
                }
            } else if (OG > .98 && Math.random() < OG) {
                chg *= (-1);
            }
            
            yArray[i][f] = OG + chg;
        }
    }
    return yArray;
}

function displayTwoDNoise() {
    if (!document.getElementById("canvasElement")) {
        let x = document.getElementById("canvasDiv");
        x.innerHTML = "<canvas id='canvasElement' width='500' height='500'></canvas>";
    }
    x = document.getElementById("canvasElement");
    let ctx = x.getContext("2d");
    ctx.strokeStyle = "#FFFFFF";
    
    let noiseToDisplay = twoDNoise(500);
    for (let i = 0; i < 500; i++) {
        for (let f = 0; f < 500; f++) {
            let colorString = "#";
            colorString1 = colorString.concat(Math.round(noiseToDisplay[i][f]*100).toString(16));
            colorString = colorString1.concat(Math.round(noiseToDisplay[i][f]*100).toString(16));
            colorString1 = colorString.concat(Math.round(noiseToDisplay[i][f]*100).toString(16));
            ctx.fillStyle = colorString1;
            ctx.fillRect(i,f,1,1);            
        }
    }
}


var noiseArray = createNoise(noiseLength);

function newNoise() {
    noiseArray = createNoise(noiseLength);
}

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
