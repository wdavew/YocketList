var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyparser = require('body-parser');
var SocketPage = require('./room.js');

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

// Post body do /queue should be formatted like so:
// req.body { link: '<new Youtube link>'}
app.get('/queue', (req, res) => {
  console.log(`/queue :: [GET] sending data ${qArray}`);
  res.status(200).send(qArray);
});

// There are two body properties that should exist non-exclusively.
// If there is a method property set to 'delete' do DELETE behavior
// If there is a link property set to a youtube url, save to the db
app.post('/queue', (req, res) => {
  console.log(`/queue :: [POST] got data ${req.body.link}`);
  console.log(req.body);
  if (req.body.method) {
    if (req.body.method === 'delete') {
      // doing app.delete resulted in interesting CORS issues
      // with preflight requirements. Even with the cors Headers
      // above. We are hackily using req.body.method to simulate RESTful
      // behavior.
      console.log(`/queue :: [DELETE] removing first item from ${qArray}`);
      qArray.shift();
      console.log(`/queue :: [DELETE] result of delete ${qArray}`);
      io.emit('newdata', qArray.length);
      res.status(200).send("");
      return;
    }
  }
  if (!req.body.link) {
    res.status(400).send("no data supplied");
    res.end();
  }
  qArray.push(req.body.link);
  console.log(`/queue :: [POST] results in ${qArray}`);
  io.emit('newdata', qArray.length);
  res.status(200).send("git it");
  res.end();
});

/* Socket and Server Setup */
io.on('connection', (socket) => {
  console.log(`User connected ${socket.id}`);
  socket.emit('connectestablished', socket.id);

  //joining a room
  socket.on('room', (data) => {
    console.log('receiving room signal');
    // red.roomExists.then((res) => {
    //   if (res === 1) {
    //     socket.join(room);
    //     socket.emit('Found room, joining');
    //   } else {
    //     socket.emit('Room does not exist');
    //   }
    // });
  });
});
  //creating a room
  app.post('/room', (req, res) => {
    let url = req.body.roomname;
    red.createRoom(url).then(res.status(200)).catch(res.status(400));
  });

  /////
  http.listen(3000, () => {
    console.log("Server started on port 3000");
  });

  module.exports = { app };
