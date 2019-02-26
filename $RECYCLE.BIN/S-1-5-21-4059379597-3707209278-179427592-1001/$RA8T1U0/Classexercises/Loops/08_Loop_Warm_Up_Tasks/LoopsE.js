function exercise1() {
    var x = document.getElementById("loope1");
    x.innerHTML = "";
    for (var i = 6;i<13;i++) {
        x.insertAdjacentHTML("beforeend", i+"<br>");
    
    }
    console.log ("i is " + i + " after the loop execution has terminated.")
}

function exercise2() {
    var x = document.getElementById("loope2");
    x.innerHTML = "";
    var i = 6;
    while (i<13) {
        x.insertAdjacentHTML("beforeend" , i+"<br>");
        i++
    }
    console.log ("i is " + i + " after the loop execution has terminated.")
}

function exercise3() {
    var x = document.getElementById("loope3");
    x.innerHTML = "";
    for (var i = 5;i>=0;i--) {
        x.insertAdjacentHTML("beforeend", i+"<br>");
    }
    console.log ("i is " + i + " after the loop execution has terminated.")
}

function exercise4() {
    var x = document.getElementById("loope4");
    x.innerHTML = "";
    for (var i = 1; i <= 10; i++) {
        x.insertAdjacentHTML("beforeend", i+"<br>");

    }
}

function exercise5() {
    var x = document.getElementById("loope5");
    var y = [];
    x.innerHTML = "";
    x.innerHTML = "<table id='loopTable'>\
    </table>";
    x = document.getElementById("loopTable");
    for (var i = 1; i <10;i++) {
        y[i-1] = "<tr>"; 
        for (var f = 1; f < 10;f++) {
            y[i-1] += "<td>"+f*i+"</td>";
        }
        y[i-1] += "</tr>";
        x.insertAdjacentHTML("beforeend", y[i-1]);
    }
    document.getElementById("loope5").insertAdjacentHTML("beforeend","<br><table id='loopTable1'></table>");
    x = document.getElementById("loopTable1");
    //var z = "<tr>";
    //for (i= 5; i<11;i++) {
    //    z+="<td>"+i+"<td>";
    //}
    //z += "</tr>";
    //x.insertAdjacentHTML("beforeend", z);
    var m;
    var n = 5;
    var b = 5;
    for (var i = 4; i <11;i++) {
        y[i-5] = "<tr>";
        for (var f = 4; f < 11;f++) {
            m = f*i;
            if (i == 4 && f == 4) {
                m = "Header"
            }
            else if (i == 4) {
                m = n;
                n++;
            } else if (f == 4) {
                m = b;
                b++;
            }
            y[i-5] += "<td>"+m+"</td>";
        }
        y[i-5] += "</tr>";
        console.log(y);
        x.insertAdjacentHTML("beforeend", y[i-5]);  
    }
}