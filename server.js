const express = require('express');
const app = express();
// Creating http server (listening on app)
const server = require('http').createServer(app);
// Creating socketIO listening to the server
const io = require('socket.io').listen(server);
const port = 3000;

users = [];
connections = [];

server.listen(port);
console.log(`Server listening on port ${port}...`);

// Seriving our index.html file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Handle connect
io.sockets.on('connection', (socket) => {
  connections.push(socket);
  console.log(`Connected: ${connections.length} sockets connected`);

  // Handle disconnect
  socket.on('disconnect', (data) => {
    users.splice(users.indexOf(socket.username), 1);
    updateUsernames();
    connections.splice(connections.indexOf(socket), 1);
    console.log(`Disconnected: ${connections.length} sockets still connected`);
  });

  // Send message
  socket.on('send message', (data) => {
    // Now we emit this message to all connected sockets
    io.sockets.emit('new message', { msg: data, user: socket.username });
  });

  // New user
  socket.on('new user', (data, callback) => {
    callback(true);
    socket.username = data;
    users.push(socket.username);
    updateUsernames();
  });

  const updateUsernames = () => {
    io.sockets.emit('get users', users);
  };
});
