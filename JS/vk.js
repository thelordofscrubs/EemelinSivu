var commentArray = [];


function displayComments() {

}

function submitComment() {
    var commentField = document.getElementById("commentin");
    var commentContent = commentField.value;
    var name = document.getElementById("commentName").value;
    let d = new Date();
    commentArray.push(new comment(commentContent, name, d.getTime()));
    PushComment(commentArray[commentArray.length]);
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
        }
    }
    let jsoncomment = JSON.stringify(commentOb);
    xhr.open("GET", "/PHP/vk.php?q="+jsoncomment, true);
    xhr.send();
}

function getComments() {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log("readyState is 4 and status is 200");
            if (this.responseXML) {
                let xml = this.responseXML;
            } else {
                console.log("this.responseXML does nto exist, exiting");
                return;
            }
            for (let i = 0 ; i < xml.getElementsByTagName("comment").length ; i++) {
                commentArray[i] = new comment(xml.getElementsByTagName("value")[i],xml.getElementsByTagName("name")[i],xml.getElementsByTagName("timeStamp")[i]);
            }
            displayComments();
        }   
    }
    xhr.open("GET", "/XML/vk.xml", true);
    xhr.send();
    displayComments();
}