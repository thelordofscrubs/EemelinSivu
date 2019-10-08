var noiseLength = 10000;
var ctx;
var vectorArray = [];
//Create the 3x3 array of unit vectors
for (let i = 0; i < 3; i++) {
    for (let f = 0; f < 3; f++) {
        vectorArray[i*3+f] = {x:i-1, y:f-1};
        /*if (vectorArray[i*3+f].x == -1) {
            vectorArray[i*3+f].x = -Math.sqrt(2)/2;
        }
        if (vectorArray[i*3+f].x == 1) {
            vectorArray[i*3+f].x = Math.sqrt(2)/2;
        }
        
        if (vectorArray[i*3+f].y == -1) {
            vectorArray[i*3+f].y = -Math.sqrt(2)/2;
        }
        if (vectorArray[i*3+f].y == 1) {
            vectorArray[i*3+f].y = Math.sqrt(2)/2;
        }*/
    }
}

var vectorArray3d = [];
for (let i = 0; i < 3; i++) {
    for (let f = 0; f < 3; f++) {
        for (let c = 0; c < 3; c++) {
            vectorArray2[vectorArray2.length] = {x:i-1, y:f-1, z:c-1};
        }
    }
}

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
            let c = 0 ;
            for (let p = -1;p < 2;p++) {
                for (let o = -1;o < 2;o++) {
                    if (array[i+p][f+o]) {
                        avg += array[i+p][f+o];
                        c++;
                    }
                }
            }
            avg /= c;   
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

var frameCoun = 0;
/*
var oldSlice = [];
for (let i = 0 ; i < 10 ; i++) {
    oldSlice[i] = [];
}
*/

function animateShape2(length=10) {
    //let ms = length*1000;
    let frames = length*40;
    if (!document.getElementById("canvasElement")) {
        let x = document.getElementById("canvasDiv");
        x.innerHTML = "<canvas id='canvasElement' width='500' height='500'></canvas>";
    }
    if (!ctx) {
        ctx = document.getElementById("canvasElement").getContext("2d");
    }
    console.log("\ncanvas exists");
    if(ctx) {
        console.log("\ncanvas contex exists");
    }
    window.ctx.clearRect(0,0,500,500);
    ctx.strokeStyle = "#FFFFFF";
    let pi = Math.PI;
    let pi2 = Math.PI*2;
    //console.log("\nframes: "+frames+"\nblur1 is "+blur1+"\nblur2 is "+blur2);
    //let tdn = twoDNoise3(frames*2,500, blur1);
    let tdn = layeredPerlin(frames*2, 500, 5);
    for (let array of tdn) {
        for (let point of array) {
            point *= 1000;
        }
    }
    console.log("\nnoise field has been created");
    /*for (let i = 0 ; i < blur2; i++) {
        tdn = blurTwoD(tdn);
    }
    console.log("\nnoise has been blurred\n");
    */frameCounter = 0;
    var timer = setInterval(function() {
        let nc2 = 250 + Math.round(Math.sin(frameCounter/30)*50);
        //let nc2 = 250
        let nc3 = 350 + Math.round((Math.cos(frameCounter/frames*pi2)*(-1)+1)*frames/3);
        let oneDSlice = [];
        oneDSlice.length = 0;
        for (let i = 0 ; i < 500 ; i++) {
            sin = Math.round((Math.sin(i*pi2/500))*100);
            cos = Math.round((Math.cos(i*pi2/500))*100);
            oneDSlice[oneDSlice.length] = tdn[nc2+cos][nc3+sin];
        }
        ctx.clearRect(0,0,500,500);
        ctx.beginPath();
        for (let i = 0 ; i < 500;i++) {
            ctx.arc(250,250,100+oneDSlice[i]*100,((pi2*i)/500),(i+1)*pi2/500);
        }
        ctx.closePath();
        ctx.stroke();
        frameCounter+=1;
        if (frameCounter == frames) {
            clearInterval(timer);
        }
    }, 25);
    //setTimeout(function(){clearInterval(timer);},ms);
}

function animateShape(length=10, blur1=100, blur2 = 5) {
    let ms = length*1000
    let frames = length*40
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
    //if (!length) {
    //    length = 1000
    //}
    //if (!blur1) {
    //    blur1 = 25
    //}
    //if (!blur2) {
    //    blur2 = 5;
    //}
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
    frameCounter = 0;
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
        let nc2 = 250 + Math.round(Math.sin(frameCounter/100)*50);
        let nc3 = Math.round(Math.cos(frameCounter/frames*pi2)*(frames/2));
        oneDSlice = [];
        oneDSlice.length = 0;
        for (let i = 0 ; i < 500 ; i++) {
            sin = Math.round((Math.sin(i*pi2/500))*50)+50;
            cos = Math.round((Math.cos(i*pi2/500))*50)+10;
            //if (frameCounter < frames/2) {
                oneDSlice[oneDSlice.length] = tdn[nc2+cos][sin+nc3];
            //}else {
            //    oneDSlice[oneDSlice.length] = tdn[nc2+cos][sin+frames-nc3+50];
            //}
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
            oneDSlice[oneDSlice.length] = tdn[nc2+i][frameCounter];
        }
        for (let i = 0 ; i < 500/4+1; i++) {
            oneDSlice[oneDSlice.length] = tdn[nc2-1+500/4+1][frameCounter+i];
        }
        for (let i = 0 ; i < 500/4+1 ; i++) {
            oneDSlice[oneDSlice.length] = tdn[(500/4+1+nc2-1)-i][frameCounter-1+500/4+1];
        }
        for (let i = 0 ; i < 500/4+1; i++) {
            oneDSlice[oneDSlice.length] = tdn[nc2][(frameCounter-1+500/4+1)-i];
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
        frameCounter+=1;
    }, 25);
    setTimeout(function(){clearInterval(timer);},ms);
}

function stopAnimation() {
    clearInterval(window.timer);
}

function displayTwoDNoise(fun=5,freq =50, layers = 3, blur2 = 2,blur1 = 100, var1 = .15,var2 = .1) {
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
            break;
        case 4:
            noiseToDisplay = betterPerlin(500,500, freq);
            break;
        case 5:
            noiseToDisplay = layeredPerlin(500,500,layers);
            break;
    }
    //for (let i = 0; i < blur2; i++) {
    //    noiseToDisplay = blurTwoD(noiseToDisplay);
    //}
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

function displayPointBox(noiseToDisplay) {
    if (!document.getElementById("canvasElement")) {
        let x = document.getElementById("canvasDiv");
        x.innerHTML = "<canvas id='canvasElement' width='500' height='500'></canvas>";
    }
    if (!ctx) {
        ctx = document.getElementById("canvasElement").getContext("2d");
    }
    ctx.strokeStyle = "#FFFFFF";
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

function Perlin3D(xdim = 500, ydim = 500, zdim = 1000 , cells = 2, amp = 1) {
    //increase the dimensions if they do not fit into the given cell amount
    //extra will simply be cut later
    if (xdim%cells != 0) {
        xdim += (cells - xdim%cells);
    }
    if (ydim%cells != 0) {
        ydim += (cells - ydim%cells);
    }
    if (zdim%Math.min(xdim, ydim) != 0) {
        zdim += (Math.min(xdim, ydim) - zdim%Math.min(xdim, ydim));
    }
    //pointDensity is the amount of points per side of each 3d cubic cell
    let pointDensity = Math.min(xdim, ydim, zdim) / cells;
    //size of the cell coordinate grid
    let bigCoords = {x: xdim/pointDensity, y: ydim/pointDensity, z: zdim/pointDensity};
    //initialize 3 dimensional array
    let finalArray = new Array(ydim);
    for (let yar of finalArray) {
        yar = new Array(xdim); 
        for (let xar of yar) {
            xar = new Array(zdim);
            for (let point of xar) {
                point = 0.5;
            }
        }
    }
    //create the gradient array
    let gradientArray = new Array(bigCoords.y+1);
    for (let yar of gadientArray) {
        yar = new Array(bigCoords.x+1);
        for (let xar of yar) {
            xar = new Array(bigCoords.z+1);
            for (let vector of xar) {
                //add a random gradient vector to each gradient point in the 3D array
                vector = vectorArray3d[Math.floor(Math.random()*vectorArray3d.length)];
            }
        }
    }
    let cornerArray = [], inX, inY, inZ, distanceArray = [];
    //first iterate through each 'cell', and iterate through each point in each cell seperately
    for (let bigY = 0; bigY < bigCoords.y; bigY++) {
        for (let bigX = 0; bigX < bigCoords.x; bigX++) {
            for (let bigZ = 0; bigZ < bigCoords.z; bigZ++) {
                //find the 8 corners of the current cell
                cornerArray = [];
                cornerArray.length = 0;
                for (let i = 0; i < 2; i++) {
                    for (let f = 0; f < 2; f++) {
                        for (let c = 0; c < 2; c++) {
                            //every possible combination of current coordinates and current coordinates + 1 using the for loops to make 2x2x2=8 selections
                            cornerArray[cornerArray.length] = gradientArray[bigY+i][bigX+f][bigZ+c];
                        }
                    }
                }
                //iterate through each point in the cell
                for (let y = 0; y < pointDensity; y++) {
                    for (let x = 0; x < pointDensity; x++) {
                        for (let z = 0; z < pointDensity; z++) {
                            //for each point, find in-cell coordinated for distance vectors
                            inY = (y+.5)/pointDensity;
                            inX = (x+.5)/pointDensity;
                            inZ = (z+.5)/pointDensity;
                            for (let i = 0; i < 2; i++) {
                                for (let f = 0; f < 2; f++) {
                                    for (let c = 0; c < 2; c++) {
                                        //every possible combination of current coordinates and current coordinates + 1 using the for loops to make 2x2x2=8 selections
                                        distanceArray[distanceArray.length] = {y:inY-i, x:inX-f, z:inZ-c};
                                    }
                                }
                            }
                            

                        }
                    }
                }
            }
        }
    }
    return finalArray;
}

function actualPerlin() {
    let pointArray = [[],[],[],[],[],[]];
    for (let i = 0; i < 6; i++) {
        for (let f = 0; f < 6; f++) {
            pointArray[i][f] = vectorArray[Math.floor(Math.random()*8)];
        }
    }
    let corners = [], scordx, scordy, dist, values = [], dp = [];
    for (let i = 0; i < 500; i++) {
        values[i] = [];
    }
    for (let i = 0; i < 5; i++) {
        for (let f = 0; f < 5; f++) {
            corners = [pointArray[i][f+1],pointArray[i+1][f+1],pointArray[i+1][f],pointArray[i][f]];
            for (let y = 0; y < 100; y++) {
                for (let x = 0; x < 100; x++) {
                    scordx = .005 + .01*x;
                    scordy = .005 + .01*y;
                    dist = [{x:scordx - 1,y:scordy - 0},{x:scordx - 1,y:scordy - 1},{x:scordx - 0,y:scordy - 1},{x:scordx - 0,y:scordy - 0}];
                    for (i1 = 0; i1 < 4; i1++) {
                        let tpv = (dist[i1].x+corners[i1].x)*(dist[i1].y+corners[i1].y);
                        dp[i1] = tpv;
                    }
                    let p1 = (100-y)*dp[0]/100 + y*dp[1]/100;
                    let p2 = (100-y)*dp[2]/100 + y*dp[3]/100;
                    let v = (100-x)*p2/100 + x*p1/100;
                        v = v*v*v*(v*(v*6-15)+10)
                    values[f*100+x][i*100+y] = v;

                }
            }
        }
    }
    return values;
}

function layeredPerlin(sizeX = 500, sizeY = 500, layers = 3, persistence = 2) {
    let startFreq = Math.round(Math.min(sizeX,sizeY)/2);
    let layersOfPerlin = betterPerlin(sizeX, sizeY, startFreq);
    for (let i = 0; i < layers-1; i++) {
        let amp = 1/(2**(i+2));
        let newLayer = betterPerlin(sizeX, sizeY, Math.round(startFreq/(persistence**(i+1))), amp);
        for (let i = 0; i < layersOfPerlin.length; i++) {
            for (let f = 0; f< layersOfPerlin[0].length; f++) {
                newLayer[i][f] -= amp/2;
                layersOfPerlin[i][f] += newLayer[i][f];
            }
        }
    }
    return layersOfPerlin;
}

function betterPerlin(xdim = 500, ydim = 500,freq = 50,amp = 1) {
    if (xdim%freq) {
        xdim += freq - xdim%freq;
    }
    if (ydim%freq) {
        ydim += freq - ydim%freq;
    }
    let numCellX = xdim/freq;
    let numCellY = ydim/freq;
    let valueTable = [];
    for (let i = 0; i < ydim;i++) {
        valueTable[i] = new Array(xdim);
        for (let f = 0; f < xdim; f++) {
            valueTable[i][f] = 0;
        }
    }
    let cornerArray = [];
    for (let i = 0; i < numCellY+1;i++) {
        cornerArray[i] = new Array(numCellX+1);
        for (let f = 0; f < numCellX+1;f++) {
            cornerArray[i][f] = vectorArray[Math.floor(Math.random()*8)];
        }
    }
    let c1, c2, c3, c4, dv1, dv2, dv3, dv4, inX, inY, dp1, dp2, dp3, dp4, l1, l2;
    for (let yCordBig = 0; yCordBig < numCellY; yCordBig++) {
        for (let xCordBig = 0; xCordBig < numCellX; xCordBig++) {
            c1 = cornerArray[yCordBig][xCordBig];
            c2 = cornerArray[yCordBig][xCordBig+1];
            c3 = cornerArray[yCordBig+1][xCordBig+1];
            c4 = cornerArray[yCordBig+1][xCordBig];
            for (let i = 0; i < freq; i++) {
                for (let f = 0 ; f < freq; f++) {
                    inX = f/freq + 1/freq/2;
                    inY = i/freq + 1/freq/2;
                    dv1 = {x:inX-0, y:inY-0};
                    dv2 = {x:inX-1, y:inY-0};
                    dv3 = {x:inX-1, y:inY-1};
                    dv4 = {x:inX-0, y:inY-1};
                    dp1 = ((dv1.x*c1.x + dv1.y*c1.y)+1)/2;
                    dp2 = ((dv2.x*c2.x + dv2.y*c2.y)+1)/2;
                    dp3 = ((dv3.x*c3.x + dv3.y*c3.y)+1)/2;
                    dp4 = ((dv4.x*c4.x + dv4.y*c4.y)+1)/2;
                    l1 = lerp(dp1, dp2, smooth(inX));
                    l2 = lerp(dp4, dp3, smooth(inX));
                    valueTable[yCordBig*freq+i][xCordBig*freq+f] = lerp(l1,l2, smooth(inY))*amp;

                }
            }
        }
    }
    return valueTable;
}

function stepPerlin(xdim = 500, ydim = 500,freq = 50,amp = 1) {
    if (!document.getElementById("canvasElement")) {
        let x = document.getElementById("canvasDiv");
        x.innerHTML = "<canvas id='canvasElement' width='500' height='500'></canvas>";
    }
    if (!ctx) {
        ctx = document.getElementById("canvasElement").getContext("2d");
    }
    ctx.strokeStyle = "#FFFFFF";
    xdim += freq - xdim%freq;
    ydim += freq - ydim%freq;
    let numCellX = xdim/freq;
    let numCellY = ydim/freq;
    let valueTable = [];
    for (let i = 0; i < ydim;i++) {
        valueTable[i] = new Array(xdim);
        for (let f = 0; f < xdim; f++) {
            valueTable[i][f] = 0;
        }
    }
    let cornerArray = [];
    for (let i = 0; i < numCellY+1;i++) {
        cornerArray[i] = new Array(numCellX+1);
        for (let f = 0; f < numCellX+1;f++) {
            cornerArray[i][f] = vectorArray[Math.floor(Math.random()*8)];
        }
    }
    let c1, c2, c3, c4, dv1, dv2, dv3, dv4, inX, inY, dp1, dp2, dp3, dp4, l1, l2;
    for (let yCordBig = 0; yCordBig < numCellY; yCordBig++) {
        for (let xCordBig = 0; xCordBig < numCellX; xCordBig++) {
            c1 = cornerArray[xCordBig][yCordBig];
            c2 = cornerArray[xCordBig+1][yCordBig];
            c3 = cornerArray[xCordBig+1][yCordBig+1];
            c4 = cornerArray[xCordBig][yCordBig+1];
            for (let i = 0; i < freq; i++) {
                for (let f = 0 ; f < freq; f++) {
                    inX = f/freq + .5/freq; 
                    inY = i/freq + .5/freq;
                    dv1 = {x:inX-0, y:inY-0};
                    dv2 = {x:inX-1, y:inY-0};
                    dv3 = {x:inX-1, y:inY-1};
                    dv4 = {x:inX-0, y:inY-1};
                    dp1 = dv1.x*c1.x + dv1.y*c1.y;
                    dp2 = dv2.x*c2.x + dv2.y*c2.y;
                    dp3 = dv3.x*c3.x + dv3.y*c3.y;
                    dp4 = dv4.x*c4.x + dv4.y*c4.y;
                    l1 = lerp(dp1, dp2, smooth(inX));
                    l2 = lerp(dp3, dp4, smooth(inX));
                    //valueTable[yCordBig*freq+i][xCordBig*freq+f] = lerp(l1,l2, smooth(inY))*amp;
                    let colorString = "#";
                    let lv = Math.round(lerp(l1,l2, smooth(inY))*amp*100).toString(16)
                    if (lv.length == 1) {
                        lv = "0".concat(lv);
                    }
                    colorString = colorString.concat(lv);
                    colorString = colorString.concat(lv);
                    colorString = colorString.concat(lv);
                    ctx.fillStyle = colorString;
                    ctx.fillRect(yCordBig*freq+i,xCordBig*freq+f,1,1); 
                }  
            }
        }
    }
    /*let yCordBig = 0, xCordBig = 0;
    let yCB = setInterval(function() {
        if (yCordBig == numCellY) {
            clearInterval(yCB);
        }
        let xCB = setInterval(function() {
            if (xCordBig == numCellX) {
                clearInterval(xCB);
            }

            xCordBig += 1;
        }, 5);
        yCordBig += 1;
    }, 10);*/
}

function smooth(value) {
    //smooth a value between 1 and 0
    return value*value*value*(value*(value*6-15)+10);
}

function lerp(v1, v2, pos) {
//v1 and v2 are the values to be interpolated
//pos is the position along the line between the two values, <0-1>
    return (v1+ pos*(v2-v1));
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
//window.addEventListener("keydown", direction);
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
