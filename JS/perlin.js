noiseLength = 10000;

function createNoise(alength, variance) {
    let noise = [];
    if (!variance) {
        variance = .15
    }
    //starting point is half
    noise[0] = .5;
    for (let i = 0; i < alength/2; i++) {
        let chg = Math.random()*variance
        //if (Math.random() < noise[i]) {
        //    chg *= (-1);
        //}
        if (Math.random() <= .5) {
            chg *= (-1);
        }
        //if the number is high, then higher probability for it to go down, same for low but opposite
        if (chg < 0 && noise[i*2] < .25) {
            if (Math.random() > noise[i]) {
                chg *= (-1);
            }
        }
        if (chg > 0 && noise[i*2] > .75) {
            if (Math.random() < noise[i]) {
                chg *= (-1);
            }
        }
        noise[i*2+2] = noise[i*2] + chg;
        noise[i*2+1] = (noise[i*2] + noise[i*2+2])/2
        //noise[i*2+2] = noise[i*2] + chg;
        //noise[i*2+1] = noise[i*2]/2 + noise[i*2+2]/2;
        
    }
    //for(let i = 0; i < noise.length; i++) {
    //    noise[i] -= .5
    //}
    return noise;
}

function twoDNoise(dimX,dimY,blur,onedvar) {
    if (!onedvar) {
        onedvar = .15;
    }
    let t1 = createNoise(dimX,onedvar);
    let t = createNoise(dimY,onedvar);
    if (blur) {
        for (let i = 0; i < blur; i++) {
            t1 = blurOneD(t1);
            t = blurOneD(t); 
        }
    }
    let yArray = [t1]
    for (let i = 1; i < dimY ; i++) {
        yArray[i] = [];
        yArray[i][0] = t[i];
        for (let f = 1; f < dimX; f++) {
            yArray[i][f] = yArray[i][0]/2+yArray[0][f]/2;
            let chg = Math.random() * 0.15;
            if (Math.random() < .5) {
                chg *= (-1);
            }
            if (chg < 0 && yArray[i][f] < .05) {
                if (Math.random() > yArray[i][f]) {
                    chg *=(-1);
                }
            } else if (chg > 0 && yArray[i][f] > .95) {
                if (Math.random() < yArray[i][f]) {
                    chg *= (-1);
                }
            }
            yArray[i][f] += chg;
            //yArray[i][f] -= (Math.min(.1,yArray[i][f]))
        }
    }
    return yArray;
}

function blurOneD(array) {
    let newArray = [array[0]];
    newArray[array.length-1] = array[array.length-1];
    for (let i = 1;i < array.length-1;i++) {
        let avg = array[i-1] + array[i] + array[i+1];
        newArray[i] = avg/3
    }
    return newArray;
}

function blurTwoD(array) {
    let newArray = [array[0]]
    for (let i = 1; i < array.length; i++) {
        newArray[i] = [];
        newArray[i][0] = array[i][0];
    }
    for (let i = 1; i < array.length-1; i++) {
        for (let f = 1; f < array[0].length-1; f++) {
            //let row1 = array[i-1][f-1] + array[i-1][f] + array[i-1][f+1];
            //let row2 = array[i][f-1] + array[i][f] + array[i][f+1];
            //let row3 = array[i+1][f-1] + array[i+1][f] + array[i+1][f+1];
            //let avg = (row1 + row2 + row3)/9;
            let avg = 0;
            for (let p = -1;p < 2;p++) {
                for (let o = -1;o < 2;o++) {
                    if (array[i+p][f+o]) {
                        avg += array[i+p][f+o];
                    }
                }
            }
            avg /= 9;   
            newArray[i][f] = avg;
        }
    }
    return newArray;
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

function displayPerlinFourier(length, blur1, blur2) {
    if (!document.getElementById("canvasElement")) {
        let x = document.getElementById("canvasDiv");
        x.innerHTML = "<canvas id='canvasElement' width='500' height='500'></canvas>";
    }
    if (!window.ctx) {
        let x = document.getElementById("canvasElement");
        window.ctx = x.getContext("2d");
    }
    let ctx = window.ctx;
    window.ctx.clearRect(0,0,500,500);
    ctx.strokeStyle = "#FFFFFF";
    let pi = Math.PI;
    let pi2 = Math.PI*2;
    if (!length) {
        length = 1000
    }
    if (!blur1) {
        blur1 = 50
    }
    if (!blur2) {
        blur2 = 10;
    }
    //let oneDNoise = createNoise(length);
    //for (let i = 0; i < blur1; i++) {
    //    oneDNoise = blurOneD(oneDNoise);
    //}
    let tdn = twoDNoise(length,length, blur1);
    for (let i = 0 ; i < blur2; i++) {
        tdn = blurTwoD(tdn);
    }
    let nc = 50;
    let oneDSlice = [];
    //drawing a kind of square in 2d noise space to get noise that ends at the same value it starts at
    for (let i = 0 ; i < length/4 ; i++) {
        oneDSlice[oneDSlice.length] = tdn[nc][nc+i];
    }
    for (let i = 0 ; i < length/4 ; i++) {
        oneDSlice[oneDSlice.length] = tdn[nc+i][nc-1+length/4];
    }
    for (let i = 0 ; i < length/4 ; i++) {
        oneDSlice[oneDSlice.length] = tdn[nc-1+length/4][(length/4+nc-1)-i];
    }
    for (let i = 0 ; i < length/4 ; i++) {
        oneDSlice[oneDSlice.length] = tdn[(nc-1+length/4)-i][nc];
    }
    ctx.beginPath();
    for (let i = 0 ; i < length;i++) {
        ctx.arc(250,250,100+oneDSlice[i]*40,(pi2*i)/length,(i+1)*pi2/length);
    }
    ctx.closePath();
    ctx.stroke();
}

var nc1 = 50;

    function animateShape(length, blur1, blur2) {
    if (!document.getElementById("canvasElement")) {
        let x = document.getElementById("canvasDiv");
        x.innerHTML = "<canvas id='canvasElement' width='500' height='500'></canvas>";
    }
    if (!window.ctx) {
        let x = document.getElementById("canvasElement");
        window.ctx = x.getContext("2d");
    }
    console.log("\ncanvas exists\n")
    let ctx = window.ctx;
    if(ctx) {
        console.log("\ncanvas contex exists\n")
    }
    window.ctx.clearRect(0,0,500,500);
    ctx.strokeStyle = "#FFFFFF";
    let pi = Math.PI;
    let pi2 = Math.PI*2;
    if (!length) {
        length = 1000
    }
    if (!blur1) {
        blur1 = 25
    }
    if (!blur2) {
        blur2 = 5;
    }
    console.log("length is "+length+"\nblur1 is "+blur1+"\nblur2 is "+blur2+"\n")
    //let oneDNoise = createNoise(length);
    //for (let i = 0; i < blur1; i++) {
    //    oneDNoise = blurOneD(oneDNoise);
    //}
    let tdn = twoDNoise(length,500, blur1);
    for (let i = 0 ; i < blur2; i++) {
        tdn = blurTwoD(tdn);
    }
    let en = twoDNoise(500 ,500, 10, .2);
    for (let i = 0 ; i < 5; i++) {
        en = blurTwoD(en);
    }
    console.log("\nnoise field exists and has been blurred\n")
    
    let oneDSlice = [];
    let oneDSlice2 = [];
    //drawing a kind of square in 2d noise space to get noise that ends at the same value it starts at
    //let flip = false;
    nc1 = 50;
    let nc2 = 50;
    for (let i = 0 ; i < length/8 ; i++) {
        oneDSlice2[oneDSlice2.length] = en[50][50+i];
    }
    for (let i = 0 ; i < length/8 ; i++) {
        oneDSlice2[oneDSlice2.length] = en[50+i][49+length/8];
    }
    for (let i = 0 ; i < length/8 ; i++) {
        oneDSlice2[oneDSlice2.length] = en[49+length/8][(49+length/8)-i];
    }
    for (let i = 0 ; i < length/8 ; i++) {
        oneDSlice2[oneDSlice2.length] = en[(49+length/8)-i][50];
    }
    let timer = setInterval(function() {
        nc2 = 250 + Math.round((oneDSlice2[nc1-50]-.5)*40);

        oneDSlice = [];
        oneDSlice.length = 0;
        for (let i = 0 ; i < 200 ; i++) {
            oneDSlice[oneDSlice.length] = tdn[nc2+i][nc1];
        }
        for (let i = 0 ; i < 500/2-200; i++) {
            oneDSlice[oneDSlice.length] = tdn[nc2-1+200][nc1+i];
        }
        for (let i = 0 ; i < 200 ; i++) {
            oneDSlice[oneDSlice.length] = tdn[(200+nc2-1)-i][nc1-1+500/2-200];
        }
        for (let i = 0 ; i < 500/2-200; i++) {
            oneDSlice[oneDSlice.length] = tdn[nc2][(nc1-1+500/2)-i-200];
        }
        //if(flip) {
            ctx.clearRect(0,0,500,500);
        //    flip = false;
        //} else {
        //    flip = true;
        //}
        ctx.beginPath();
        for (let i = 0 ; i < 500;i++) {
            ctx.arc(250,250,100+oneDSlice[i]*40,((pi2*i)/500),(i+1)*pi2/500);
        }
        ctx.closePath();
        ctx.stroke();
        nc1+=1;
    }, 20);
    setTimeout(function(){clearInterval(timer);},length*10);
}

function stopAnimation() {
    clearInterval(window.timer);
}

function displayTwoDNoise(blur,blur1) {
    if (!document.getElementById("canvasElement")) {
        let x = document.getElementById("canvasDiv");
        x.innerHTML = "<canvas id='canvasElement' width='500' height='500'></canvas>";
    }
    x = document.getElementById("canvasElement");
    let ctx = x.getContext("2d");
    ctx.strokeStyle = "#FFFFFF";
    
    //let noise = twoDNoise(500);
    let noiseToDisplay = twoDNoise(500,blur1)
    for (let i = 0; i < blur; i++) {
        noiseToDisplay = blurTwoD(noiseToDisplay);
    }
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
