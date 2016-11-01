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
    return redisController.addAdmin('Room 1', 'user 5')
      .then(() => client.getAsync('Room 1admin').should.eventually.equal('user 5'));
  });
});

describe('addVideo', () => {
  it('should add a video url string to the room key', () => {
    return redisController.addVideo('Room 1', 'www.video.com')
      .then(() => client.zrangeAsync('Room 1videos', '0', '0').should.eventually.deep.equal(['www.video.com']));
  });
  it('should throw error if the video url is already in the room\'s queue', () => {
    return redisController.addVideo('Room 1', 'www.video.com').should.be.rejectedWith('video already in queue')
  });
});

describe('incScore', () => {
  it('should increment a video\'s score', () => {
    return redisController.incScore('Room 1', 'www.video.com')
      .then(() => client.zscoreAsync('Room 1videos', 'www.video.com').should.eventually.equal('1'))
  });
  it('should return a number with the video\'s new score after incrementing', () => {
    return redisController.incScore('Room 1', 'www.video.com').should.eventually.equal(2);
  });
});

describe('returnVideo', () => {
  it('should return the video in first place as a string', () => {
    return client.zaddAsync('Room 1videos', 0, 'www.video2.com')
      .then(() => {
        return redisController.returnVideo('Room 1').should.eventually.equal('www.video.com');
      });
  });

  it('should remove the returned video from the sorted set', () => {
    return client.zscoreAsync('Room 1videos', 'www.video.com').should.eventually.equal(null);
  })

  it('should get the next highest ranked video after removing the higest ranked video', () => {
    return redisController.returnVideo('Room 1').should.eventually.equal('www.video2.com');
  });
});

describe('createRoom', () => {
  it('should add a room to the database', () => {
    return redisController.createRoom('MyRoom')
      .then(() => {
        return client.hgetAsync('rooms', 'MyRoom').should.eventually.equal('1')
      });
  });
  it('should throw an error if the requested room name already exists', () => {
    return redisController.createRoom('MyRoom').should.be.rejectedWith('room already exists')
  });
});

describe('roomExists', () => {
  it('should return a boolean', () => {
    return redisController.roomExists('hi').then(resp => typeof resp).should.eventually.equal('boolean');
  })

  it('should return true for a room that already exists', () => {
    return redisController.roomExists('hi').should.eventually.equal(false);
  })

  it('should return false for a room that doesn\'t exist yet', () => {
    return redisController.roomExists('MyRoom').should.eventually.equal(true);
  });
});

describe('returnQueue', () => {
  it('should return all existing rooms in the correct order', () => {
    return client.zaddAsync('Room 1videos', 5, 'www.video2.com')
      .then(client.zaddAsync('Room 1videos', 0, 'www.video3.com'))
      .then(client.zaddAsync('Room 1videos', 7, 'www.video1.com'))
      .then(() => {
        return redisController.returnQueue('Room 1').should.eventually.deep.equal(['www.video1.com', 'www.video2.com', 'www.video3.com']);
      })
  });

  it('should return an array', () => {
    return redisController.returnQueue('Room 1').then(resp => Array.isArray(resp)).should.be.ok;
  })

  describe('removeFromQueue', () => {
    it('should remove a video from the queue', () => {
      return redisController.removeFromQueue('Room 1', 'www.video3.com')
        .then(client.zscoreAsync('Room 1videos', 'www.video3.com').should.eventually.equal(null));
    });
    it('should throw an error if the provided url is not in the queue', () => {
      return redisController.removeFromQueue('Room 1', 'www.videothatdoesnotexisst.com').should.be.rejectedWith('the video url does not exist');
  });
})

});
