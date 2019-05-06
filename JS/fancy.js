function showNav() {
    if (document.getElementById("style1")) {
        let x = document.getElementById("navbarParentActive");
        x.innerHTML="";
        x.setAttribute("id","navbarParent");
    }else{
        let x = document.getElementById("navbarParent");
        x.innerHTML = "\
        <div class='ssButton' onclick='style1()' id='style1'>\
            <span>Flexbox<span>\
        </div>\
        <div class='ssButton' onclick='style2()' id='style2'>\
        <span>Grid<span> \
        </div>\
        <div class='ssButton' onclick='style3()' id='style3'>\
        <span>Floats<span>\
        </div>\
        <div class='ssButton' onclick='backToMain()' id='escape'>\
        <span>Main site<span>\
        </div>";
        x.setAttribute("id","navbarParentActive");
    }
}

function backToMain() {
    window.open("/index.html","_top");
}

function style1() {
    let x = document.getElementById("styleLink");
    x.setAttribute("href","/CSS/fancy1.css");
    vidParam();
}

function style2() {
    let x = document.getElementById("styleLink");
    x.setAttribute("href","/CSS/fancy2.css");
    vidParam();
}
function style3() {
    let x = document.getElementById("styleLink");
    x.setAttribute("href","/CSS/fancy3.css");
    vidParam();
}

function vidParam() {
    setTimeout(function () {let x = document.getElementById("infoVid");
    let h = window.innerHeight;
    let w = window.innerWidth;
        x.setAttribute("height",Math.min(w*.75-70,480));
        x.setAttribute("width", Math.min(w-70,640));
    }, 200);
    setTimeout(function () {let x = document.getElementsByTagName("img");
        let w = window.innerWidth;
        w -= 40;
        for (let i = 0 ; i < x.length ; i++) {
            x[i].setAttribute("height",Math.min(250,w/4));
            x[i].setAttribute("width",Math.min(250*.75,w/4*.75));
        }
    },200);
}

window.addEventListener("resize", vidParam);








/*"\
    <div class='ssButton' onclick='style1()' id='style1'>\
        Switch to using flexbox\
    </div>\
    <div class='ssButton' onclick='style2()' id='style2'>\
        Switch to using grid \
    </div>\
    <div class='ssButton' onclick='style3()' id='style3'>\
        Switch to using tables\
    </div>\
    <div class='ssButton' onclick='backToMain()' id='escape'>\
    </div>"
*/