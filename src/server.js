// All Requirement packages
const exp = require('constants');
var express = require('express');
var path = require('path');
var app = express();

// Hosting using http & app
var port = process.env.PORT || 8000;
var http = require('http').createServer(app);
http.listen(port, () => { console.log("Server is running on " + port); });

// Show Main Pages
var url = path.join(__dirname, '../');
app.use(express.static(url));

// socket Work
var { Server } = require('socket.io');
var io = new Server(http);
var users = {};

// Count online member
function online() {
    var l = Object.keys(users).length;
    if (l <= 1) io.emit('kitne_log', 'You');
    else if (l > 1) io.emit('kitne_log', l - 1);
    io.emit('ye_log', users);
}

// Main socket functions like connection,disconnect,msgEvent
io.on('connection', (socket) => {
    socket.on('join', (sname) => {
        users[socket.id] = sname;
        socket.broadcast.emit('join_kisne_kiya', sname);
        console.log(sname + ' join the chat!');
        online();
    });

    socket.on('chat', (sname, smsg) => {
        console.log("Name :" + sname);
        console.log("Message :" + smsg + "\n");
        socket.broadcast.emit('chat_ka_msg', sname, smsg);
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('leave_kisne_kiya', users[socket.id]);
        console.log(users[socket.id] + ' left the chat!');
        delete users[socket.id];
        online();
    });
});