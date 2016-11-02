var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyparser = require('body-parser');
var cookieParser = require('cookie-parser');
var SocketPage = require('./room.js');
var redisController = require('./redisController.js').red;

const queueController = require('./queueController.js')
app.use(express.static(__dirname + '../client/stylesheets'));

/* Database */
const qArray = [];


/* Express Middleware */
app.use(bodyparser.json());

// CORS headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  next();
});

//utilizing cookieparser
app.use(cookieParser());

//creating a room
app.post('/createRoom', queueController.createRoom, queueController.setAdmin)
  
  // get request to retrieve queue for a given room
  app.get('/queue/:room', queueController.getQueue);

  // post request to add a video to a room's queue
  app.post('/addToQueue', queueController.addToQueue, (req, res) => {
    io.emit('newdata');
    return res.status(200).end('successfully added to queue')
  });

  // post request to remove a video from a room's queue
  app.post('/removeFromQueue', queueController.checkAdminCookie, queueController.removeFromQueue, (req, res) => {
    io.emit('newdata');
    return res.status(200).end('successfully removed from queue')
  });

  /* Socket and Server Setup */
  io.on('connection', (socket) => {
    console.log(`User connected ${socket.id}`);
    socket.emit('connectestablished', socket.id);

    //joining a room
    socket.on('room', (data) => {
      redisController.roomExists.then((exists) => {
        if (exists) {
          socket.join(room);
          socket.emit('joiningRoom', { roomName: room });
        } else {
          socket.emit('roomDoesNotExist');
        }
      });
    });
  });



  /////
  http.listen(3000, () => {
    console.log("Server started on port 3000");
  });

  module.exports = { app };
