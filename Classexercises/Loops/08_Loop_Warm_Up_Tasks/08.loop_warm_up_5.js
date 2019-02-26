// 08.loop_warm_up_5.js JavasScript code

// Task 1 (easy): Modify the JavaScript code so that it shows a multiplication table 1-9 by 1-9. 
// Task 2 (challenging): 
//         Modify the JavaScript code again so that it shows a multiplication table 5-10 by 5-10. 


document.write("<table>");

document.write("<tr>");
document.write("<td>*</td>");
for (var i = 1; i <= 4; i++ ) {
        document.write("<td>" + i + "</td>");
}
document.write("</tr>");

for (var y = 1; y <= 4; y++) {
    document.write("<tr>");
    document.write("<td>" + y + "</td>");

    for (var x = 1; x <= 4; x++ ) {
        document.write("<td>" + (y * x) + "</td>");
    }

    document.write("</tr>");
}

document.write("</table>"); 

// End