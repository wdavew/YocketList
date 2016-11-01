const request = require('supertest');
const superagent = require('superagent');
const redis = require('redis'), client = redis.createClient();
const app = require('../../server/server.js');
const PORT = 3000;
const HOST = `http://localhost:${PORT}`;
const io = require('socket.io');
const { expect } = require('chai');
const cookieParser = require('cookie-parser');

// fill db with test data
before(() => {
  client.flushdb();
  client.zadd('Room1videos', 0, 'www.video.com');
  client.hset('rooms', 'Room1', 1);
  client.zadd('Room1videos', 0, 'www.video.com');
  client.zadd('Room1videos', 5, 'www.video2.com');
  client.set('Room1admin', 'george');
});


describe('Route integration', () => {
  describe('Server has /queue/:room route', () => {
    describe('GET', () => {
      it('should respond with a 200 status code', done => {
        request(HOST)
          .get('/queue/Room1')
          .expect(200, done);
      });
      it('should respond with an array of youtube urls', done => {
        request(HOST)
          .get('/queue/Room1')
          .expect((res) => {
            expect(res.body).to.be.an('array');
            expect(res.body).to.deep.equal(['www.video2.com', 'www.video.com'])
          })
          .expect(200, done);
      });
    });
  })
});
//adding videos to queue
describe('Server has /addToQueue route', () => {
  describe('POST', () => {
    it('should return 200 when supplied with a valid link and room', done => {
      request(HOST)
        .post('/addToQueue')
        .send({ link: 'https://www.youtube.com/watch?v=_9vK_F0XnfA', room: 'Room1' })
        .expect(200, done);
    });
    it('should return 400 when not supplied with a link', done => {
      request(HOST)
        .post('/addToQueue')
        .send({ room: 'Room1' })
        .expect(400, done);
    });
    it('should return 400 when supplied with a room', done => {
      request(HOST)
        .post('/addToQueue')
        .send({ link: 'https://www.youtube.com/watch?v=_9vK_F0XnfA' })
        .expect(400, done);
    });
    it('should return 400 when supplied with an invalid link', done => {
      request(HOST)
        .post('/addToQueue')
        .send({ link: 'https://www.youtube.com/waatch?v=_9vK_F0XnfA', room: 'Room1' })
        .expect(400, done);
    });
    it('should return 400 when supplied with an invalid room', done => {
      request(HOST)
        .post('/addToQueue')
        .send({ link: 'https://www.youtube.com/watch?v=_9vK_F0XnfA', room: 'Room27' })
        .expect(400, done);
    });
  });
});



// before(() => {
//   const req = request(HOST)
//     .post('/createRoom')
//   agent.attachCookies(req);
//   req.send({ roomName: 'testRoom' })
//   console.log(agent);
// })
// describe('Server has /removeFromQueue route', () => {
//   describe('POST', () => {
//     it('should return 200 when supplied with a valid link and room', done => {
//       request(HOST)
//         .post('/removeFromQueue')
//         .set('Cookie', ['adminRoom1=true'])
//         .send({ link: 'https://www.youtube.com/watch?v=_9vK_F0XnfA', room: 'Room1' })
//         .expect(200, done);
//     });
// it('should return 400 when not supplied with a link', done => {
//   request(HOST)
//     .post('/removeFromQueue')
//     .send({ link: 'https://www.youuuutube.com/watch?v=_9vK_F0XnfA', room: 'Room1' })
//     .expect(400, done);
// });
// it("should return 400 when supplied with a room that doesn't exist", done => {
//   request(HOST)
//     .post('/removeFromQueue')
//     .send({ link: 'https://www.youtube.com/watch?v=_9vK_F0XnfA', room: 'Room27' })
//     .expect(400, done);
// });
// it("should return 400 when the user does not have an admin cookie", done => {
//   request(HOST)
//     .post('/removeFromQueue')
//     .set('Cookie', [])
//     .send({ link: 'https://www.youtube.com/watch?v=_9vK_F0XnfA', room: 'Room1' })
//     .expect(400, done);
//   // });
// });
// });

//creating a room 
describe('Server has /createRoom route', () => {
  describe('POST', () => {
    const agent = request.agent(app);

    it('should return 200 when supplied with a room name that does not exist yet', done => {
      request(HOST)
        .post('/createRoom')
        .send({ roomName: 'newRoom' })
        .expect(200, done);
    });
    it('should return 400 when not supplied with a room name', done => {
      request(HOST)
        .post('/createRoom')
        .send({})
        .expect(400, done);
    });
    it("should return 400 when supplied with a room that already exists", done => {
      request(HOST)
        .post('/createRoom')
        .send({ roomName: 'newRoom' })
        .expect(400, done);
    });
    it("should save a cookie when creating a room", done => {
      agent
        .post('/createRoom')
        // .send({ roomName: 'newRoom2' })
        .expect('set-cookie', 'adminnewRoom2=true');
    });
  });
});