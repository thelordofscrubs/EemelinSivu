var noiseLength = 10000;
var ctx;

function createContext() {  
    let x = document.getElementById("canvasDiv");
    x.innerHTML = "<canvas id='canvasElement' width='500' height='500'></canvas>";
    x = document.getElementById("canvasElement")
    ctx = x.getContext("2d");
}

function createNoise(alength, variance = .15) {
    let noise = [];
    //if (!variance) {
    //    variance = .15
    //}
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
        if (chg < 0 && noise[i*2] < variance*1.5) {
            if (Math.random() > noise[i]) {
                chg *= (-1);
            }
        }
        if (chg > 0 && noise[i*2] > 1-variance*1.5) {
            if (Math.random() < noise[i]) {
                chg *= (-1);
            }
        }
        noise[i*2+2] = noise[i*2] + chg;
        if (noise[i*2+2] > 1) {
            noise[i*2+2] = 1;
        }
        if (noise[i*2+2] < 0) {
            noise[i*2+2] = 0;
        }
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
            let chg = Math.random() * 0.01;
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

function twoDNoise3(dimx=500,dimy=500,blur=500,onev=.3,twov=.5,) {
    let array = [createNoise(dimx, onev)];
    let array2 = createNoise(dimy, onev);
    for (let i = 0 ; i < blur ; i++) {
        array[0] = blurOneD(array[0]);
        array2 = blurOneD(array2);
    }
    for (let i = 1 ; i < dimy ; i++) {
        array[i] = [];
        array[i][0] = array2[i];
    }
    for (let i = 1 ; i < dimy ; i++) {
        for (let f = 1; f < dimx ; f++) {
            /*
            let a = 0;
            let avg = array[i-1][f];
            a++;
            if (array[i-1][f-1]) {
                avg += array[i-1][f-1];
                a++;
            }
            if (array[i-1][f+1]) {
                avg += array[i-1][f+1];
                a++;
            }
            array[i][f] = avg/a;
            array[i][f] += (Math.random()-.5)*twov*2;
            */

           array[i][f] = (array[i][0])*(array[0][f])*2;
           array[i][f] += (Math.random()-.5)*twov*2;

        }
    }
    return array;
}


function threeDNoise(dim) {
    let zArray = [twoDNoise(dim)];
    let t1 = twoDNoise(dim);
    let t2 = twoDNoise(dim);
    for (let i = 1; i < dim; i++) {
        zArray[i] = [];

        
    }
}


function displayPerlinFourier(length, blur1, blur2) {
    if (!document.getElementById("canvasElement")) {
        let x = document.getElementById("canvasDiv");
        x.innerHTML = "<canvas id='canvasElement' width='500' height='500'></canvas>";
    }
    //if (!window.ctx) {
    //    let x = document.getElementById("canvasElement");
    //    window.ctx = x.getContext("2d");
    //}
    if (!ctx) {
        ctx = document.getElementById("canvasElement").getContext("2d");
    }
    ctx.clearRect(0,0,500,500);
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

var nc1 = 0;
/*
var oldSlice = [];
for (let i = 0 ; i < 10 ; i++) {
    oldSlice[i] = [];
}
*/
function animateShape(length=10, blur1=500, blur2 = 15) {
    let ms = length*1000
    let frames = length*50
    if (!document.getElementById("canvasElement")) {
        let x = document.getElementById("canvasDiv");
        x.innerHTML = "<canvas id='canvasElement' width='500' height='500'></canvas>";
    }
    if (!ctx) {
        ctx = document.getElementById("canvasElement").getContext("2d");
    }
    console.log("\ncanvas exists")
    if(ctx) {
        console.log("\ncanvas contex exists")
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
    console.log("\nframes: "+frames+"\nblur1 is "+blur1+"\nblur2 is "+blur2)
    //let oneDNoise = createNoise(length);
    //for (let i = 0; i < blur1; i++) {
    //    oneDNoise = blurOneD(oneDNoise);
    //}
    let tdn = twoDNoise3(frames + 300,500, blur1);
    console.log("\nnoise field has been created")
    for (let i = 0 ; i < blur2; i++) {
        tdn = blurTwoD(tdn);
    }
    //let en = twoDNoise3(200, 200, 100, .2,5);
    //for (let i = 0 ; i < 2; i++) {
    //    en = blurTwoD(en);
    //}
    console.log("\nnoise has been blurred\n")
    
    let oneDSlice = [];
    let oneDSlice2 = [];
    //drawing a kind of square in 2d noise space to get noise that ends at the same value it starts at
    //let flip = false;
    nc1 = 0;
    let nc2 = 0;
    /*
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
    */
    let flipper = false;
    let timer = setInterval(function() {
        nc2 = 250 + Math.round(Math.sin(nc1/100)*50);
        oneDSlice = [];
        oneDSlice.length = 0;
        for (let i = 0 ; i < 500 ; i++) {
            sin = Math.round((Math.sin(i*pi2/500))*50)+50;
            cos = Math.round((Math.cos(i*pi2/500))*50)+10;
            if (nc1 < frames/2) {
                oneDSlice[oneDSlice.length] = tdn[nc2+cos][sin+nc1+50];
            }else {
                oneDSlice[oneDSlice.length] = tdn[nc2+cos][sin+frames-nc1+50];
            }
        } 
        /*switch(flipper) {
            case false:
                nc2++;
                if (nc2 == 125) {
                    flipper = true;
                }
                break;
            case true:
                nc2--;
                if (nc2 == 10) {
                    flipper = false;
                }
        }
        */
        /*
        oneDSlice = [];
        oneDSlice.length = 0;
        for (let i = 0 ; i < 500/4+1 ; i++) {
            oneDSlice[oneDSlice.length] = tdn[nc2+i][nc1];
        }
        for (let i = 0 ; i < 500/4+1; i++) {
            oneDSlice[oneDSlice.length] = tdn[nc2-1+500/4+1][nc1+i];
        }
        for (let i = 0 ; i < 500/4+1 ; i++) {
            oneDSlice[oneDSlice.length] = tdn[(500/4+1+nc2-1)-i][nc1-1+500/4+1];
        }
        for (let i = 0 ; i < 500/4+1; i++) {
            oneDSlice[oneDSlice.length] = tdn[nc2][(nc1-1+500/4+1)-i];
        }*/
        //if(flip) {
            ctx.clearRect(0,0,500,500);
        //    flip = false;
        //} else {
        //    flip = true;
        //}
        ctx.beginPath();
        for (let i = 0 ; i < 500;i++) {
            ctx.arc(250,250,100+oneDSlice[i]*20,((pi2*i)/500),(i+1)*pi2/500);
        }
        ctx.closePath();
        ctx.stroke();
        /*
        for (let f = 0 ; f < 10 ; f++) {
            if (oldSlice[f][0]) {
                switch (f) {
                    case 0:
                        ctx.strokeStyle = "CCCCCC";
                        break;
                    case 1:
                        ctx.strokeStyle = "999999";
                        break;
                    case 2:
                        ctx.strokeStyle = "666666";
                        break;
                    case 3:
                        ctx.strokeStyle = "333333";
                        break;
                }
                ctx.beginPath();
                for (let i = 0 ; i < 500;i++) {
                    ctx.arc(250,250,100+oneDSlice[i]*20,((pi2*i)/500),(i+1)*pi2/500);
                }
                ctx.closePath();
                ctx.stroke();        
            } else {
                break;
            }
        }
        for (let i = 9 ; i > 1 ; i--) {
            oldSlice [i] = oldSlice[i-1];
        }
        oldSlice[0] = oneDSlice;
        */
        nc1+=1;
    }, 20);
    setTimeout(function(){clearInterval(timer);},ms);
}

function stopAnimation() {
    clearInterval(window.timer);
}

function displayTwoDNoise(blur2 = 2,blur1 = 100, var1 = .15,fun=3,var2 = .1) {
    if (!document.getElementById("canvasElement")) {
        let x = document.getElementById("canvasDiv");
        x.innerHTML = "<canvas id='canvasElement' width='500' height='500'></canvas>";
    }
    if (!ctx) {
        ctx = document.getElementById("canvasElement").getContext("2d");
    }
    ctx.strokeStyle = "#FFFFFF";
    
    //let noise = twoDNoise(500);
    let noiseToDisplay;
    switch(fun) {
        case 1:
            noiseToDisplay = twoDNoise(500,500,blur1,var1);
            break;
        case 2:
            noiseToDisplay = twoDNoise2(500);
            break;
        case 3:
            noiseToDisplay = twoDNoise3(500,500,blur1,var1,var2);
    }
    for (let i = 0; i < blur2; i++) {
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


//var noiseArray = createNoise(noiseLength);

//function newNoise() {
//    noiseArray = createNoise(noiseLength);
//}

function displayNoise(variance=.15,blur,xCord=0) {
    if (!document.getElementById("canvasElement")) {
        let x = document.getElementById("canvasDiv");
        x.innerHTML = "<canvas id='canvasElement' width='500' height='500'></canvas>";
    }
    if (!ctx) {
        ctx = document.getElementById("canvasElement").getContext("2d");
    }
    ctx.clearRect(0,0,500,500);
    window.ctx.clearRect(0,0,500,500);     
    ctx.strokeStyle = "#FFFFFF";
    //ctx.moveTo(0,400);
    //ctx.lineTo(500,400);
    //ctx.stroke();
    let noiseArray = createNoise(500,variance);
    //ctx.clearRect(0,0,500,500);
    for (let i = 0; i < blur; i++) {
        noiseArray = blurOneD(noiseArray);
    }
    ctx.beginPath();
    ctx.moveTo(0,300);
    ctx.lineTo(500,300);
    ctx.moveTo(0,200);
    ctx.lineTo(500,200);
    ctx.moveTo(0,250);
    for (let i = 1; i < 250; i++) {
        ctx.lineTo(i*2,300-noiseArray[i*2+xCord]*100);
        let avg = noiseArray[i*2+xCord]+noiseArray[i*2+xCord+2]
        ctx.lineTo(i*2+1,300-avg/2*100);
        //ctx.stroke();
        //ctx.moveTo(i+1,noiseArray[i]*50);
    }
    ctx.stroke();
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
