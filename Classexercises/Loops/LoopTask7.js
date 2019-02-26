function calcEarn() {
    var rounds = document.getElementById("rounds").value
    var bets = rounds;
    var wins = 0;
    var winMul = 1.25;
    var winMul1 = 1.5;
    for (var i = 0; i < rounds; i++) {
        var x = Math.floor(Math.random()*6);
        //console.log(x);
        if (x == 0 || x == 1) {
            wins += winMul
            console.log(wins)
        } else if (x == 2) {
            wins += winMul1
            console.log(wins)
        }
    }
    var profit = bets - wins;
    var output = document.getElementById("Output");
    output.innerHTML = "\
    Total bets were "+bets+" euros<br>\
    Total winnings were "+wins+" euros<br>\
    Total Profit was "+profit+" euros\
    Average Profit per game run was "+(wins/rounds).toFixed(3)+" euros";
}