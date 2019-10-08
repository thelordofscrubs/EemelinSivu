var keylist = {};
var vertexShaderText = [
'precision mediump float;',
'',
'attribute vec2 vertPosition;',
'',
'void main()',
'{',
'gl_Position = vec4(vertPosition, 0.0, 1.0);',
'}'
].join('\n');
var fragShaderText = [
'precision mediump float;',
'',
'void main()',
'{',
'gl_FragColor = vec4(1.0,0.0,0.0,1.0);',
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

    gl.compileShader(vertexShader)
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
window.addEventListener("keyup", keypressed)
window.addEventListener("keydown", keypressed);