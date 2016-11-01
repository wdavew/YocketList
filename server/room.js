const {red} = require('../server/redisController');
const {socket} = require('../server/server.js');


//create new room - A room is created when a socket (user) joins it.
  // socket.on('join', socketId => {
  //     socket.join(socketId);
  // });

  // //only update videos for users in same room
  // socket.on('newVideo', (socketId, data) => {
  //   socket.to(socketId).emit('newVideo', data)
  //   //io.sockets.in(roomId).emit('newVideo', data);
  // });

  // //leave a room
  // socket.on('close', socketId => {
  //   socket.leave(socketId);
  // });


// /*ON CLIENT SIDE*/
