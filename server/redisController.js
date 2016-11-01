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
	}
};


module.exports = {red};