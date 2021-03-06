var commentArray = [];


function displayComments() {
    let x = document.getElementById("comments");
    x.innerHTML = "";
    for (let i = 0 ; i < commentArray.length ; i++) {        
        x.insertAdjacentHTML("beforeend","\
        <div class='comment'>\
        <h6 class='commentHeader'>"+commentArray[i].name+"</h6>\
        <p class='commentBody'>"+commentArray[i].value+"</p>\
        <p class='timeStamp'>"+commentArray[i].timeStamp.slice(0,25)+"</p>\
        </div>");
    }
}

function submitComment() {
    var commentField = document.getElementById("commentin");
    var commentContent = commentField.value;
    if (commentContent == "" || commentContent == "Insert comment here") {
        return;
    }
    var name = document.getElementById("commentName").value;
    let d = new Date();
    commentArray.push(new comment(commentContent, name, d.toString()));
    PushComment(commentArray[commentArray.length-1]);
    commentField.value = "";
    displayComments();
}

function comment(content, name, time) {
    this.value = content;
    this.name = name;
    this.timeStamp = time;
    //this.id = commentArray[commentArray.length].id+1;
}

function setCookie() {

}

function getCookie() {

}

function PushComment(commentOb) {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log("score sent to xml");
            console.log(this.responseText);
            //getComments();
        }
    }
    let jsoncomment = JSON.stringify(commentOb);
    console.log(jsoncomment);
    xhr.open("GET", "/PHP/vk.php?q="+jsoncomment, true);
    xhr.send();
}

function getComments() {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log("readyState is 4 and status is 200");
            if (!this.responseXML) {
                console.log("this.responseXML does nto exist, exiting");
                return;
            }
            let xml = this.responseXML;
            //console.log(this.responseText);
            console.log(xml);
            commentArray = [];
            commentArray.length = 0;
            for (let i = 0 ; i < xml.getElementsByTagName("comment").length ; i++) {
                let value = xml.getElementsByTagName("value")[i].childNodes[0].nodeValue;
                let name = xml.getElementsByTagName("name")[i].childNodes[0].nodeValue;
                let timeStamp = xml.getElementsByTagName("timeStamp")[i].childNodes[0].nodeValue;
                commentArray[i] = new comment(value, name, timeStamp);
            }
            setTimeout(displayComments(),300);
        }   
    }
    xhr.open("GET", "/XML/vk.xml", true);
    xhr.send();
    //displayComments();
}