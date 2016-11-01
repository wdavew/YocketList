var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyparser = require('body-parser');
var cookieparser = require('cookie-parser');
var SocketPage = require('./room.js');
const queueController = require('./queueController.js')


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
app.post('/room', (req, res) => {
  let url = req.body.roomname;
  res.cookie(`admin${url}`, 'true');
  red.createRoom(url).then(res.status(200)).catch(res.status(400));
});

// get request to retrieve queue for a given room
app.get('/queue/:room', (req, res) => {
  console.log(`/queue :: calling queuecontroller `);
  return queueController.getQueue(req, res)
});

// post request to add a video to a room's queue
app.post('/addToQueue', queueController.addToQueue, (req, res) => {
  io.emit('newdata');
  return res.status(200).end('successfully added to queue')
});

// post request to remove a video from a room's queue
app.post('/removeFromQueue', queueController.removeFromQueue, (req, res) => {
  io.emit('newdata');
  return res.status(200).end('successfully removed from queue')
});

/* Socket and Server Setup */
io.on('connection', (socket) => {
  console.log(`User connected ${socket.id}`);
  socket.emit('connectestablished', socket.id);

  //joining a room
  socket.on('room', (id, data) => {
    red.roomExists.then((res) => {
      if (res === 1) {
        socket.join(room);
        socket.emit('Found room, joining');
      } else {
        socket.emit('Room does not exist');
      }
    });
  });
});



/////
http.listen(3000, () => {
  console.log("Server started on port 3000");
});

module.exports = { app };
