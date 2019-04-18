noiseLength = 10000;

function createNoise(alength) {
    let noise = [];
    //starting point is half
    noise[0] = .5;
    for (let i = 0; i < alength/10; i++) {
        let chg = Math.random()*.1
        //if (Math.random() < noise[i]) {
        //    chg *= (-1);
        //}
        if (Math.random() <= .5) {
            chg *= (-1);
        }
        //if the number is high, then higher probability for it to go down, same for low but opposite
        if (chg < 0 && noise[i*10] < .2) {
            if (Math.random() > noise[i]) {
                chg *= (-1);
            }
        }
        if (chg > 0 && noise[i*10] > .8) {
            if (Math.random() < noise[i]) {
                chg *= (-1);
            }
        }
        noise[i*10+10] = noise[i*10] + chg;
        for (let f = 0;f < 9; f++) {
            noise[i*10+f+1] = noise[i*10]*((10-f+1)/10)+noise[i*10+10]*((f+1)/10);
        }
        //noise[i*2+2] = noise[i*2] + chg;
        //noise[i*2+1] = noise[i*2]/2 + noise[i*2+2]/2;
        
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
            
            yArray[i][f] = yArray[i][0]/2+yArray[0][f]/2;
            //yArray[i][f] -= (Math.min(.1,yArray[i][f]))
        }
    }
    return yArray;
}

function noiseObject(NV, n) {
    this.noiseValue = NV;
    this.neighbors = n;
}

function twoDNoise2(dimL) {
    //let yArray = createNoise(dimL);
    let oArray = [createNoise(dimL)];
    /*
    for (let i = 0; i<dimL;i++) {
        let n = 2
        if (i == 0 || i == dimL-1) {
            n = 1
        }
        oArray[0][i] = yArray[i];//new noiseObject(yArray[i],n);
    } 
    */
    for (let i = 1; i < dimL ; i++) {
        oArray[i] = [];
        for (let f = 1; f < dimL; f++) {
            let pL = oArray[i-1];
            let OG = (pL[f]+pL[f-1]+pL[f+1])/3;
            if (f == 1) {
                OG = (pL[f]+pL[f+1])/2;
            }
            if (f == dimL-1) {
                OG = (pL[f]+pL[f-1])/2;
            }
            let chg = Math.random()*.08;
            if (Math.random()<.5) { 
                chg *= (-1);
                if (OG < .1 && Math.random() > OG) {
                    chg *= (-1);
                }
            } else if (OG > .98 && Math.random() < OG) {
                chg *= (-1);
            }
            oArray[i][f] = OG + chg;
        }
    }
    return oArray;
}

/*
function threeDNoise(dim) {
    let zArray = [twoDNoise(dim)];
    let t1 = twoDNoise(dim);
    let t2 = twoDNoise(dim);
    for (let i = 1; i < dim; i++) {
        zArray[i] = [];

        
    }
}
*/

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
            let lv = Math.round(noiseToDisplay[i][f]*100).toString(16)
            if (lv.length == 1) {
                lv = "0".concat(lv);
            }
            colorString = colorString.concat(lv);
            colorString = colorString.concat(lv);
            colorString = colorString.concat(lv);
            ctx.fillStyle = colorString;
            ctx.fillRect(f,i,1,1);            
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
