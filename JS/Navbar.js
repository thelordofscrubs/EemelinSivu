function NavBar() {

document.getElementById("navbar").innerHTML= "\
<a href='/JSlist.html'>Javascript</a>\
<a href='/gameList.html'>Games</a>\
<a href='/pictures.html'>Pictures</a>\
<a href='/OtherStuff.html'>Don't fall for it</a>\
<a href='/vk.html'>Vieraskirja (Guest Book)</a>\
<div id = 'more'>\
    <a href='/index.html'>Main</a>\
</div>\
";
}

function displayNav() {
    if (document.getElementById("navBut1")) {
        document.getElementById("navBut1").innerHTML="";
        document.getElementById("navBut1").setAttribute("id","navBut");
    } else {
        document.getElementById("navBut").innerHTML="\
        <a href='/JSlist.html'>Javascript</a>\
        <a href='/pictures.html'>Pictures</a>\
        <a href='/OtherStuff.html'>Misc</a>\
        <a href='/vk.html'>Vieraskirja (Guest Book)</a>\
        <div id = 'more1'>\
            <a href='/index.html'>Main</a>\
        </div>\
        ";
        document.getElementById("navBut").setAttribute("id","navBut1");
    }
}