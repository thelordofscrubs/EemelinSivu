var tog = false;


function displayNav() {
    var x = document.getElementById("toggle");

    switch(tog) {
        case false:
            //display navbar
            x.innerHTML = '\
                <ul>\
                <li><a href="landing.html">Main</a></li>\
                <li><a href="Course.html" ></a></li>\
                <li><a href="JavaScript.html">Javascript</a> </li> \
                <li><a href="Plan.html">Plan</a></li>\
                <li><a href="Career.html">Furture career</a></li> \
                </ul>\
            ';
            tog = true;
            break;
        case true:
            x.innerHTML = "";
            tog = false;
    }
}