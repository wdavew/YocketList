const redis = require('redis'), client = redis.createClient();
const {expect} = require('chai');
const bluebird = require('bluebird');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

describe('addAmin', () => {
  it('should add a roomnumber key with cookie val', () => {
    redisController.addAdmin('Room 1', 'user 5');
    client.getAsync('Room 1')
    .then(res => expect(res).to.equal('user 5'));
  });
});