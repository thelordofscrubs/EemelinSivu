function rollTheDice() {
    var p = document.getElementById("p");
    var start = parseInt(document.getElementById("start").value);
    var end = parseInt(document.getElementById("end").value);
    var diceValue = randomInt(start, end);
    p.innerHTML = diceValue;
}

function randomInt(from, to) {
    console.log(from);
    console.log(to);
    return Math.ceil(
        Math.random() * (to-from+1)
    )+from-1;
}