var express  = require('express');
var http = require('http');
var socketio = require('socket.io');

var app = express();

var server = http.createServer(app)

var io = socketio(server);
var ioUser = socketio(server,  {  path: '/user' });
var ioAdmin = socketio(server, {  path: '/admin' })

app.use('/', express.static(__dirname + '/static'));

server.listen(8282);

let usersConnections = {}

ioUser.on('connection', function (socket) {
    let account = socket.handshake.headers['x-account'];
    usersConnections[account] = socket;
    console.log('User connected', account)
    socket.once("disconnect", ()=>{
        usersConnections[account] = undefined;
        console.log("User disconnected", account);
    })
});


ioAdmin.on('connection', function (socket) {
  adminConnection = socket;
  socket.on('tx', ({account, payload})=> {
      console.log('New tx', account, payload)
      if(account && usersConnections[account]) {
        usersConnections[account].emit('tx', payload)
      }
  })
})