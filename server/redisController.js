const redis = require('redis'), client = redis.createClient();

client.on("error", function (err) {
    console.log("Error " + err);
});

let red = {
	//adding administrator
	 addAdmin: function(roomNum, cookie){
		client.set(`${roomNum}admin`, cookie);
	},

	//adding videos
	 addVideo: function(roomNum, videoUrl) {
		client.zadd([`${roomNum}videos`, 0, videoUrl], (err, response) => {
			if (err) throw err;
			console.log('added ' + response + ' items.');
		})
	},

	//increment score
	 incScore: function(roomNum, videoUrl) {
		client.zincrby([`${roomNum}videos`, 1, videoUrl], (err, response) => {
			if (err) throw err;
			console.log('added ' + response + ' items.');
		})
	},

	//remove & return 'next' video
	 returnVideo: function(roomNum, videoUrl){
		let urlOfNextVideo = client.zrange([`${videoUrl}`, 0, 0]);

		client.zremrangebyrank([`${roomNum}videos`, 0, 0], (err, response) => {
			if (err) throw err;
			console.log("removed video");
		})
		return urlOfNextVideo;
	}
};


module.exports = {red};