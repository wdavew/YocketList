const redis = require('redis'), client = redis.createClient();
const bluebird = require('bluebird');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

client.on("error", function (err) {
	console.log("Error " + err);
});

let red = {
	// adds administrator with given roomnum key
	 addAdmin: function (roomNum) {
		return client.setAsync(`${roomNum}admin`)
	},

	//adds a video with the given roomnum key
	 addVideo: function (roomNum, videoUrl) {
		
		// check if video is already queued
		return client.zscoreAsync(`${roomNum}videos`, videoUrl)
		.then((response) => {
			if (response) throw new Error('video already in queue');
			else return client.zaddAsync([`${roomNum}videos`, 0, videoUrl])
			.catch((err) => {
				throw err;
			});
		})
	},

	//increments score of a video
	 incScore: function (videoUrl, roomNum) {
		 console.log(videoUrl);
		 console.log(`${roomNum}videos`);
		return client.zincrbyAsync(`${roomNum}videos`, 1, videoUrl)
			.then(resp => Number(resp))
			.catch(err => {
				throw (err)
			});
		},

	// remove & return 'next' video
	// will return a promise object that resolves to the video url
	 returnVideo: function (roomNum) {
		let urlOfNextVideo;
		return client.zrevrangeAsync([`${roomNum}videos`, 0, 0])
			.then(resp => urlOfNextVideo = resp)
			.then(client.zremrangebyrankAsync([`${roomNum}videos`, -1, -1]))
			.then(resp => urlOfNextVideo[0])
			.catch(err => console.log('error in return video'));
	},

	// creates a room if it does not already exist; throws error if the room exists
	createRoom: function (roomNum) {
		return this.roomExists(roomNum).then(response => {
			if (!response) {
				return client.hsetAsync(['rooms', roomNum, 1]);
			} else throw new Error('room already exists');
		})
	},

	// returns a boolean indicating whether or not the provided room exists
	roomExists: function (roomNum) {
		return client.hexistsAsync(['rooms', roomNum])
			.then(response => Boolean(response));
	},

	// returns all videos in queue sorted by votes (descending) as an array
	returnQueue: function (roomNum) {
		const outputList = [];
		return client.zrevrangeAsync(`${roomNum}videos`, 0, -1, 'WITHSCORES')
		.then(resp => {
				let obj = {}
				resp.forEach((val, index) => {
			if (index % 2 == 0) obj.url = val;
			else {
				obj.score = val;
				outputList.push(obj);
				console.log(outputList);
				obj = {}
			}
				});
		}).then(() => outputList);
	}, 

	// removes a video from the queuxe and throws error if the url is not currently queued
	removeFromQueue: function (roomNum, videoUrl) {
		return client.zremAsync(`${roomNum}videos`, videoUrl)
		.then((resp) => {
			if (resp === 0) throw new Error('the video url does not exist');
		})
	}
	
};


module.exports = { red };