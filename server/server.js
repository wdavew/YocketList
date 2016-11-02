var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyparser = require('body-parser');
var cookieParser = require('cookie-parser');
var SocketPage = require('./room.js');
var redisController = require('./redisController.js').red;
var cors = require('cors');
var corser = require('corser');

const queueController = require('./queueController.js')


/* Database */
const qArray = [];


/* Express Middleware */
app.use(bodyparser.json());
// app.use(cors());
app.use(cookieParser());

// CORS headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Credentials", "true")
  next();
});

//creating a room
app.post('/createRoom', queueController.createRoom)

// get request to retrieve queue for a given room
app.get('/queue/:room', queueController.getQueue);

// get next video in queue
app.get('/getNextVideo/:room', queueController.getNextVideo);

// post request to add a video to a room's queue
app.post('/addToQueue', queueController.addToQueue, (req, res) => {
  console.log('emitting socket for ', req.body.room);
  io.to(req.body.room).emit('newdata');
  return res.status(200).end('successfully added to queue')
});

// post request to remove a video from a room's queue
app.post('/removeFromQueue', queueController.removeFromQueue, (req, res) => {
  io.emit('newdata');
  return res.status(200).end('successfully removed from queue')
});

app.post('/increaseVote', queueController.vote)

/* Socket and Server Setup */
io.on('connection', (socket) => {
  console.log(`User connected ${socket.id}`);
  socket.emit('connectestablished', socket.id);

  //joining a room
  socket.on('room', (data) => {
    redisController.roomExists(data.roomName).then((exists) => {
      if (exists) {
        socket.join(data.roomName);
        socket.emit('joiningRoom', { roomName: data.roomName });
        socket.broadcast.to(data.roomName).emit('newUser');
      } else {
        socket.emit('roomDoesNotExist');
      }
    });
  });
  
  //updating data
  socket.on('refreshQueue', ({room}) => {
    console.log('request from', room, 'to refresh queue');
    io.to(room).emit('newdata');
  });

  socket.on('currentVideo', ({room, url, start}) => {
    console.log('sending current video to new user');
    socket.broadcast.to(room).emit('vidUrl', {url, start});
  });

    socket.on('adminPlay', ({room}) => {
    socket.broadcast.to(room).emit('play');
  });

    socket.on('adminPause', ({room}) => {
    socket.broadcast.to(room).emit('pause');
  });

});

  /////
  http.listen(3000, () => {
    console.log("Server started on port 3000");
  });

  module.exports = { app };
