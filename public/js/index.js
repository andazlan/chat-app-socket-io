var socket = io();

socket.on('connect', function () {
    console.log('connected to server');
    
    socket.emit('createMessage', {
        from : 'azlan@me.com',
        text : 'this message from browser'
    });
});

socket.on('disconnect', function () {
    console.log('disconnected from server');
});

socket.on('newMessage', function (message) {  
    console.log('New message', message);
});