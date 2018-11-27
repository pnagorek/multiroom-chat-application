const socketio = require('socket.io');

let io;
let guestNumber = 1;
const nickNames = {};
const namesUsed = [];
const currentRoom = {};

const assignGuestNumber = (socket) => {
  const name = `Guest ${guestNumber}`;
  nickNames[socket.id] = name;
  socket.emit('nameResult', {
    success: true,
    name,
  });
  namesUsed.push(name);
  guestNumber += 1;
};

const joinRoom = (socket, room) => {
  socket.join(room);
  currentRoom[socket.id] = room;
  socket.emit('joinResult', { room });
  socket.broadcast.to(room).emit('message', {
    text: `${nickNames[socket.id]} has joined ${room}.`,
  });

  io.of('/').in(room).clients((error, clients) => {
    const usersInRoom = clients.length;

    if (usersInRoom.length > 1) {
      let usersInRoomSummary = `Users currently in ${room}: `;
      Object.keys(usersInRoom).forEach((key) => {
        if (key !== socket.id) {
          usersInRoomSummary += `${nickNames[key]}, `;
        }
      });
      socket.emit('message', { text: usersInRoomSummary });
    }
  });
};

const handleNameChangeAttemps = (socket) => {
  socket.on('nameAttempt', (name) => {
    if (name.indexOf('Guest') === 0) {
      socket.emit('nameResult', {
        success: false,
        message: 'Names cannot begin with "Guest".',
      });
    } else if (namesUsed.indexOf(name) === -1) {
      const previousName = nickNames[socket.id];
      const previousNameIndex = namesUsed.indexOf[previousName];
      namesUsed.push(name);
      nickNames[socket.id] = name;
      delete namesUsed[previousNameIndex];
      socket.emit('nameResult', {
        success: true,
        name,
      });
      socket.broadcast.to(currentRoom[socket.id]).emit('message', {
        text: `${previousName} is now known as ${name}`,
      });
    } else {
      socket.emit('nameResult', {
        success: false,
        message: 'That name is already in use.',
      });
    }
  });
};

const handleMessageBroadcasting = (socket) => {
  socket.on('message', (message) => {
    console.log(message.text);
    socket.broadcast.to(message.room).emit('message', {
      text: `${nickNames[socket.id]}: ${message.text}`,
    });
  });
};

const handleRoomJoining = (socket) => {
  socket.on('join', (room) => {
    socket.leave(currentRoom[socket.id]);
    joinRoom(socket, room.newRoom);
  });
};

const handleClientDisconnetion = (socket) => {
  socket.on('disconnect', () => {
    const nameIndex = namesUsed.indexOf(nickNames[socket.id]);
    delete namesUsed[nameIndex];
    delete nickNames[socket.id];
  });
};

const listen = (server) => {
  io = socketio(server);

  io.on('connection', (socket) => {
    assignGuestNumber(socket, guestNumber);

    joinRoom(socket, 'Lobby');

    handleMessageBroadcasting(socket);

    handleNameChangeAttemps(socket);

    handleRoomJoining(socket);

    socket.on('rooms', () => {
      socket.emit('rooms', io.sockets.adapter.rooms);
    });

    handleClientDisconnetion(socket, nickNames, namesUsed);
  });
};

module.exports = {
  listen,
};
