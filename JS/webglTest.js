//import { mat4 } from "./gl-matrix.js";

var keylist = {};
var vertexShaderText = [
'precision mediump float;',
'',
'attribute vec3 vertPosition;',
'attribute vec3 vertColor;',
'uniform mat4 mWorld;',
'uniform mat4 mView;',
'uniform mat4 mProj;',
'varying vec3 fragColor;',
'',
'void main()',
'{',
'fragColor = vertColor;',
'gl_Position = mProj * mView * mWorld *vec4(vertPosition, 1.0);',
//mProj * mView * mWorld * 
'}'
].join('\n');
var fragShaderText = [
'precision mediump float;',
'varying vec3 fragColor;',
'void main()',
'{',
'gl_FragColor = vec4(fragColor,1.0);',
'}'
].join('\n');
function main() {
    console.log("started main")
    const canvas = document.querySelector("#canvas1");
    const gl = canvas.getContext("webgl");
    //console.log(gl);
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderText);
    gl.shaderSource(fragmentShader, fragShaderText);

    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);

    if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error("ERROR compiling", gl.getShaderInfoLog(vertexShader));
        return;
    }
    if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error("ERROR compiling", gl.getShaderInfoLog(fragmentShader));
        return;
    }

    var program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("ERROR linking program", gl.getProgramInfoLog(program));
    }
    
    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.error("ERROR validating", gl.getProgramInfoLog(program));
    }

    var triangleVertices = [
    //X , Y, Z  R, G, B
    0.0, 0.5, 0.0,  Math.random(), Math.random(), Math.random(),
    -0.5, -0.5, 0.0, Math.random(), Math.random(), Math.random(),
    0.5, -0.5, 0.0,  Math.random(), Math.random(), Math.random()
    ];

    var boxVertices = [
        //X , Y, Z, R, G, B
        //top
        -1.0, 1.0, -1.0, 0.5, 0.5, 0.5,
        -1.0, 1.0, 1.0 , 0.5, 0.5, 0.5,
        1.0, 1.0 , 1.0 , 0.5, 0.5, 0.5,
        1.0, 1.0, -1.0 , 0.5, 0.5, 0.5,   
        //left
        -1.0, 1.0, 1.0 , 0.5, 0.5, 0.5,
        -1.0, -1.0, 1.0, 0.5, 0.5, 0.5,
        -1.0, -1.0, -1.0,0.5, 0.5, 0.5,

    ]
    var triangleVertices32 = new Float32Array(triangleVertices);

    var triangleVertexBufferOb = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferOb);
    gl.bufferData(gl.ARRAY_BUFFER, triangleVertices32, gl.DYNAMIC_DRAW);

    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
    gl.vertexAttribPointer(
        positionAttribLocation,
        3, //num of elem
        gl.FLOAT, //type
        gl.FALSE,
        6 * Float32Array.BYTES_PER_ELEMENT,
        0
    );
    gl.vertexAttribPointer(
        colorAttribLocation,
        3, //num of elem
        gl.FLOAT, //type
        gl.FALSE,
        6 * Float32Array.BYTES_PER_ELEMENT,
        3 * Float32Array.BYTES_PER_ELEMENT
    );

    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(colorAttribLocation);

    gl.useProgram(program);

    var matWorldUniformLocation = gl.getUniformLocation(program, "mWorld");
    var matViewUniformLocation = gl.getUniformLocation(program, "mView");
    var matProjUniformLocation = gl.getUniformLocation(program, "mProj");

    var projMatrix = new Float32Array(16);
    var viewMatrix = new Float32Array(16);
    var worldMatrix = new Float32Array(16);

    glMatrix.mat4.identity(worldMatrix);
    glMatrix.mat4.lookAt(viewMatrix, [0, 0, -4], [0,0,0], [0,1,0]);
    glMatrix.mat4.perspective(projMatrix,glMatrix.glMatrix.toRadian(45),canvas.width/canvas.height,0.1,1000.0);

    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
    gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

    //main render loop

        var angle = 0;
        var identityMatrix = new Float32Array(16);
        glMatrix.mat4.identity(identityMatrix);
        var incdec = [];
        for (let i = 0; i < 9; i++) {
            incdec[i] = Math.random() >= 0.5;
        }
        let si = 0;

        function loop() {
            triangleVertices32[3] = triangleVertices32[3] + .001;
            if (triangleVertices32[3] > 1) {
                triangleVertices32[3] = 0;
            }
            si = 0
            for (let i = 0; i < 18; i++) {
                if (![3,4,5,9,10,11,15,16,17].includes(i)) {
                    continue;
                }
                switch (incdec[si]) {
                    case false:
                            triangleVertices32[i] -= .005;
                            if (triangleVertices32[i] <= 0.2    ) {
                                incdec[si] = true;
                            }
                            break;
                    case true:
                            triangleVertices32[i] += .005;
                            if (triangleVertices32[i] >= 0.98) {
                                incdec[si] = false;
                            }
                }
                si++;
            }
            gl.bufferData(gl.ARRAY_BUFFER, triangleVertices32, gl.DYNAMIC_DRAW);
            /*
            triangleVertices[5]
            triangleVertices[9]
            triangleVertices[10]
            triangleVertices[11]
            triangleVertices[15]
            triangleVertices[16]
            triangleVertices[17]*/

            angle = performance.now() / 1000 / 10 * 2 * Math.PI;
            glMatrix.mat4.rotate(worldMatrix, identityMatrix, angle, [0, 1, 0]);
            gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            gl.drawArrays(gl.TRIANGLES, 0, 3);        
            requestAnimationFrame(loop);

        }
        requestAnimationFrame(loop);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
}
function keypressed(e) {
    //console.log("keyboard event object: ");
    //console.log(e);
    keylist[e.key] = e.type == "keydown";
    //console.log(keylist);
    if (keylist.s && keylist.Alt) {
        main();
    }
   
}
//window.addEventListener("keyup", keypressed);
//window.addEventListener("keydown", keypressed);