var commentArray = [];




function submitComment() {
    var commentField = document.getElementById("commentin");
    var commentContent = commentField.value;
    var name = document.getElementById("commentName").value;
    commentArray.push(new comment(commentContent, name));
    PushComment(commentArray[commentArray.length]);
}

function comment(content, name) {
    this.content = content;
    this.name = name;
}

function PushComment(commentOb) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log("score sent to xml");
        }
    }
    var jsoncomment = JSON.stringify(commentOb);
    xhr.open("GET", "/PHP/vk.php?q="+jsoncomment, true);
    xhr.send();
}

function getComments() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {

    }
    xhr.open("GET", "/XML/vk.xml", true);
    xhr.send();
}