//var e = '';
//document.getElementById("HelloText").addEventListener("keydown", CheckKey(e));
function mouseOverf() {
    document.getElementById("mouseOver").innerHTML = "Hello World!";

}
function mouseOutf() {
    document.getElementById("mouseOver").innerHTML = "Mouse over this!";

}
function HelloButton() {
    alert("Hello World!");

}
function HelloText() {
var possInput = ['Hello','hello','hi','Hi','hello world','Hello world','Hello World','hello World','HELLO WORLD','Hello World!','ur mum gay','your mum gay','Your mother is homosexual'];
var uInput = document.getElementById("HelloText").value;
if (possInput.indexOf(uInput) > -1) {
    alert("Hello World!");
}

}
//function CheckKey(e) {
//    console.log("CheckKey() is being run");
//    var x = e.keyCode;
//    if (x == 13) {
//        HelloText();
//        document.getElementById("HelloText").value = "";
//    }
//}
