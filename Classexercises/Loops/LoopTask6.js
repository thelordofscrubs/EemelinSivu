function calcVotes() {
    var cf = document.getElementById("candField");
    var vf = document.getElementById("votesField");
    var candidates = cf.value;
    var votes = vf.value;
    var resultT = document.getElementById("resultsT");
    resultT.innerHTML ="<tr>\
    <th>Candidate</th>\
    <th>Comparison Score</th>\
</tr>";
    for (var i = 0; i < candidates; i++) {
        resultT.insertAdjacentHTML("beforeend","<tr><td>"+(i+1)+"</td><td>"+Math.floor(votes/(i+1))+"</td></tr>");
    }
}