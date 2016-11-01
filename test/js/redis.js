const redis = require('redis'), client = redis.createClient();
const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");
const bluebird = require('bluebird');
const redisController = require('../../server/redisController').red
chai.use(chaiAsPromised);
chai.should();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

before(() => {
  client.flushdb();
})
describe('addAmin', () => {
  it('should add a roomnumber key with cookie val', () => {
    redisController.addAdmin('Room 1', 'user 5');
    return client.getAsync('Room 1admin').should.eventually.equal('user 5');
  });
});

describe('addVideo', () => {
  it('should add a roomnumber key with cookie val', () => {
    redisController.addVideo('Room 1', 'www.video.com');
    return client.zrangeAsync('Room 1videos', '0', '0').should.eventually.deep.equal(['www.video.com']);
  });
});

describe('incScore', () => {
  it('should increment a video\'s score', () => {
    redisController.incScore('Room 1', 'www.video.com');
    return client.zscoreAsync('Room 1videos', 'www.video.com').should.eventually.equal('1');
  });
});

describe('returnVideo', () => {
  it('should return the video in first place as a string', () => {
    client.zaddAsync('Room 1videos', 0, 'www.video2.com')
    return client.zrangeAsync('Room 1videos', 0, 2)
      .then(() => {
        return redisController.returnVideo('Room 1').should.eventually.equal('www.video2.com');
      });
  });

  it('should remove the returned video from the sorted set', () => {
    return client.zscoreAsync('Room 1videos', 'www.video.com').should.eventually.equal('1');
  })

  it('should get the next highest ranked video after removing the higest ranked video', () => {
    return redisController.returnVideo('Room 1').should.eventually.equal('www.video.com');
  });

});