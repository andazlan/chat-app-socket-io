const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

var users = new Users();

app.use(express.static(publicPath));

//listen to connection
io.on('connection', (socket) => {
    console.log('New user connected');
    //greet the individual user
    //socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

    //for all users
    //socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));
    
    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback('Name and room are required');
        }

        if (users.isRegistered(params.name, params.room)){
            return callback('User has been registerd, try to use other name');
        }

        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUserList', users.getUserList(params.room));

        //socket.leave('the office fans');

        //io.emit(); -> io.to('the office fans').emit();

        //broadcast all message, accept current user
        //socket.broadcast.emit(); -> socket.broadcast.to('the office fan').emit

        //just for one user
        //socket.emit

        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));    
        callback();
    });

    socket.on('createMessage', (message, callback) => {
        //console.log('createMessage', message);
        var user = users.getUser(socket.id);
        if (user && isRealString(message.text)) {
            //single connection
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }
        //io.emit('newMessage', generateMessage(message.from, message.text));
        callback();
    });

    socket.on('createLocationMessage', (coords) => {
        var user = users.getUser(socket.id);
        if (user) {
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
        }
    });

    socket.on('disconnect', () => {
        //console.log('User was disconnected');
        var user = users.removeUser(socket.id);
        if (user) {
            //udpate user list
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            //print message like andrew has left the room
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
        }
    });
});

server.listen(port, () => {
    console.log('Server is up on port ' + port);
});