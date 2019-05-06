function sizePic() {
    let x = document.getElementsByClassName("jobImg");
    for (let i = 0 ; i < x.length ; i++) {
        x[i].setAttribute("height",window.innerWidth/3);
        x[i].setAttribute("width",window.innerWidth/5);
    }
}

window.addEventListener("resize",sizePic);