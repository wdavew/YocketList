const request = require('supertest');
const redis = require('redis'), client = redis.createClient();
const app = require('../../server/server.js');
const PORT = 3000;
const HOST = `http://localhost:${PORT}`;
const io = require('socket.io');
const { expect } = require('chai');

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


  describe('Server has /removeFromQueue route', () => {
    describe('POST', () => {
      it('should return 200 when supplied with a valid link and room', done => {
        request(HOST)
          .post('/removeFromQueue')
          .send({ link: 'https://www.youtube.com/watch?v=_9vK_F0XnfA', room: 'Room1' })
          .expect(200, done);
      });
      it('should return 400 when not supplied with a link', done => {
        request(HOST)
          .post('/removeFromQueue')
          .send({ link: 'https://www.youuuutube.com/watch?v=_9vK_F0XnfA', room: 'Room1' })
          .expect(400, done);
      });
      it("should return 400 when supplied with a room that doesn't exist", done => {
        request(HOST)
          .post('/removeFromQueue')
          .send({ link: 'https://www.youtube.com/watch?v=_9vK_F0XnfA', room: 'Room27' })
          .expect(400, done);
      });
    });
  });



});