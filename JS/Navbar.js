function NavBar() {

document.getElementById("navbar").innerHTML= "\
<a href='/JSlist.html'>Javascript</a>\
<a href='/pictures.html'>Pictures</a>\
<a href='/OtherStuff.html'>Misc</a>\
<a href='/vk.html'>Vieraskirja (Guest Book)</a>\
<a href='/fancy.html'>CSS project (Kasper)</a>\
<div id = 'more'>\
    <a href='/index.html'>Main</a>\
</div>\
";
}

function displayNav() {
    if (document.getElementById("more1")) {
        document.getElementById("navBut").innerHTML="";
    } else {
        document.getElementById("navBut").innerHTML="\
        <a href='/JSlist.html'>Javascript</a>\
        <a href='/pictures.html'>Pictures</a>\
        <a href='/OtherStuff.html'>Misc</a>\
        <a href='/vk.html'>Vieraskirja (Guest Book)</a>\
        <a href='/fancy.html'>CSS project (Kasper)</a>\
        <div id = 'more1'>\
            <a href='/index.html'>Main</a>\
        </div>\
        ";
    }
}