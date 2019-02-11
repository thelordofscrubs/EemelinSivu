// DebuggingExercise.js
// 


function classifyAge() {
    var outputText;
    
    var ageText = document.getElementById("txtAge").value;
    if (0 < Number(ageText) && Number(ageText) < 122) {
        var age = Number(ageText);

        if (age < 18) {
            outputText = "You're a minor.";
        } else {
            outputText = "You're an adult.";
        }
    } else {
        outputText = "Please enter an integer between 0 and 122.";
    }
    document.getElementById("pOutput").innerHTML = outputText;
    
}

function enterSubmit(e) {
    var x = e.keyCode;
    if (x == 13) {
        console.log("enter pressed");
        classifyAge();
    }
}