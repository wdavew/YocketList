const redis = require('redis'), client = redis.createClient();
const bluebird = require('bluebird');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

client.on("error", function (err) {
    console.log("Error " + err);
});

let red = {
	// adds administrator with given roomnum key
	 addAdmin: function(roomNum, cookie){
		client.set(`${roomNum}admin`, cookie);
	},

	//adds a video with the given roomnum key
	 addVideo: function(roomNum, videoUrl) {
		client.zadd([`${roomNum}videos`, 0, videoUrl], (err, response) => {
			if (err) throw err;
			console.log('added ' + response + ' items.');
		})
	},

	//increments score of a video
	 incScore: function(roomNum, videoUrl) {
		client.zincrby([`${roomNum}videos`, 1, videoUrl], (err, response) => {
			if (err) throw err;
			console.log('added ' + response + ' items.');
		})
	},

	// remove & return 'next' video
	// will return a promise object that resolves to the video url
	 returnVideo: function(roomNum){
		let urlOfNextVideo;
		return client.zrangeAsync([`${roomNum}videos`, 0, 0])
		.then(resp => urlOfNextVideo = resp)
		.then(client.zremrangebyrankAsync([`${roomNum}videos`, 0, 0]))
		.then(resp => urlOfNextVideo[0])
		.catch(err => console.log('error in return video'));
	},

	// creates a room if it does not already exist; throws error if the room exists
	createRoom: function(roomNum){
		return this.roomExists(roomNum).then(response => {
			if (!response) {
				return client.hsetAsync(['rooms', roomNum, 1]);
			} else throw new Error('room already exists');
		})
	},

	// returns a boolean indicating whether or not the provided room exists
	roomExists: function(roomNum){
		return client.hexistsAsync(['rooms', roomNum])
		.then(response => Boolean(response));
	},

	// returns all videos in queue sorted by votes as an array
	returnQueue: function(roomNum){
		return client.zrevrangeAsync([`${roomNum}videos`, 0, -1])
	}
};


module.exports = {red};