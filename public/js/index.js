// All Variable
var entryname = document.getElementById('entryname');
var detail = document.getElementById('detail');
var cross = document.getElementById('cross');
var showusers = document.getElementsByClassName('showusers')[0];
var userstack = document.getElementsByClassName('userstack')[0];
var infobox = document.getElementById('infobox');
var enter = document.getElementById('enter');
var box = document.getElementById('box');
var textarea = document.getElementById('textarea');
var msgarea = document.getElementById('msgarea');
var send = document.getElementById('send');
var count = document.getElementById('count');
var audio = document.getElementById('audio');
// var ting=new Audio('../music/ting.mp3');
var val = "";
var name = "";
var exist = 0;

// Time function
function currtime() {
    var time = "";
    var today = new Date();
    var hr = today.getHours();
    var min = today.getMinutes();
    if (hr < 10 && min < 10) time = "0" + hr + ":" + "0" + min;
    else if (hr < 10 && min >= 10) time = "0" + hr + ":" + min;
    else if (hr >= 10 && min < 10) time = hr + ":" + "0" + min;
    else if (hr >= 10 && min >= 10) time = hr + ":" + min;
    return time;
}

// Message area scroll to bottom every 100ms
window.setInterval(()=>{
    msgarea.scrollTop=msgarea.scrollHeight;
},100);

// Show All Users toggle via details and cross btn
detail.addEventListener("click", () => {
    showusers.classList.toggle("show");
});
cross.addEventListener("click", () => {
    showusers.classList.toggle("show");

});

// take message
textarea.addEventListener("keyup", (e) => {
    val = e.target.value;
});

// Socket.io work
var socket = io();

// take entry name with validation
enter.addEventListener("click", () => {
    name = entryname.value;
    if ((name != "") && (name[0] != " ") && (name.match(/^[A-Za-z\s]*$/))) {
        infobox.style.display = "none";
        box.style.display = "flex";
        socket.emit('join', name);
    }
    else {
        if (exist == 0) {
            var errp = document.createElement("p");
            infobox.appendChild(errp);
            errp.classList.add("err");
            errp.appendChild(document.createTextNode("* Please enter a valid name (only letters)"));
            exist = 1;
        }
    }
});

// Create message div (incomming or outgoing) dynamically
function creatediv(kisne, kya, type) {

    var newh5 = document.createElement("h5");
    var newp = document.createElement("p");
    var newh6 = document.createElement("h6");

    msgarea.appendChild(newh5);
    msgarea.appendChild(newp);
    msgarea.appendChild(newh6);

    if (type == 'incomming') {
        newh5.classList.add("me");
        newp.classList.add("mymsg");
        newh6.classList.add("mytime");
        newp.appendChild(document.createTextNode(val));
    }
    else if (type == 'outgoing') {
        audio.play();
        newh5.classList.add("user");
        newp.classList.add("usermsg");
        newh6.classList.add("usertime");
        newp.appendChild(document.createTextNode(kya));
    }
    newh5.appendChild(document.createTextNode(kisne));
    newh6.appendChild(document.createTextNode(currtime()));
}

// Create status span(join or left) dynamically
function createspan(kisne, type) {
    var newspan = document.createElement("span");
    msgarea.appendChild(newspan);
    if (type == 'joining') {
        newspan.classList.add("con");
        newspan.appendChild(document.createTextNode(kisne + " join the chat"));
    }
    else if (type = 'leaving') {
        newspan.classList.add("leave");
        newspan.appendChild(document.createTextNode(kisne + " left the chat"));
    }
}

// Create users list dynamically
function createuser(userOBJ){
    var idARR=Object.keys(userOBJ);
    var nameARR=Object.values(userOBJ);
    userstack.innerHTML="";
    for(var i=0;i<idARR.length;i++){
        var userspan = document.createElement("span");
        userstack.appendChild(userspan);
        if(idARR[i]==socket.id){
            userspan.classList.add("you");
            userspan.appendChild(document.createTextNode("You:"+nameARR[i]));
        }
        else {
            userspan.classList.add("otheruser");
            userspan.appendChild(document.createTextNode(nameARR[i]));
        }
    }
}

send.addEventListener("click", () => {
    if (!textarea.value == "") {
        creatediv(name, val, 'incomming');
        socket.emit('chat', name, val);
        textarea.value = '';
    }
});

socket.on('join_kisne_kiya', function (isne_join_kiya) { createspan(isne_join_kiya, 'joining'); });
socket.on('chat_ka_msg', function (iska_msg, ye_msg) { creatediv(iska_msg, ye_msg, 'outgoing'); });
socket.on('leave_kisne_kiya', function (isne_left_kiya) { createspan(isne_left_kiya, 'leaving'); });
socket.on('kitne_log', function (itne_log) { count.innerHTML = itne_log; });
socket.on('ye_log',function (userOBJ){ createuser(userOBJ);});
