const redisController = require('./redisController').red
const bodyparser = require('body-parser');

function matchYoutubeUrl(url) {
    const p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    if (url.match(p)) return true;
    return false;
}

const queueController = {
    getQueue: (req, res) => {
        console.log('getting data for ', req.params.room);
        redisController.returnQueue(req.params.room)
            .then(data => {
                console.log(data);
                return res.status(200).json(data)
            });
    },

    addToQueue: (req, res, next) => {
        if (!req.body.link) return res.status(400).send("no link supplied")
        if (!req.body.room) return res.status(400).send("no room supplied")
        if (!matchYoutubeUrl(req.body.link)) return res.status(400).send("invalid youtube url")
        redisController.roomExists(req.body.room)
            .then((exists) => {
                if (!exists) {
                    return res.status(400).send("that room doesn't exist")
                }
                redisController.addVideo(req.body.room, req.body.link)
                    .then(() => {
                        next();
                    })
                    .catch(() => res.status(400).send('the requeusted video is already queued'));
            })
    },

    vote: (req, res, next) => {
        redisController.incScore(req.body.link, req.body.room)
        .then(resp => res.json(resp));
    },


    removeFromQueue: (req, res, next) => {
        if (!req.body.link) return res.status(400).send("no link supplied")
        if (!req.body.room) return res.status(400).send("no room supplied")
        if (!matchYoutubeUrl(req.body.link)) return res.status(400).send("invalid youtube url")
        redisController.roomExists(req.body.room)
            .then((exists) => {
                if (!exists) {
                    return res.status(400).send("that room doesn't exist")
                }
                redisController.removeFromQueue(req.body.room, req.body.link)
                    .then(() => res.status(200).send('removed the video from queue'))
                    .catch(() => res.status(400).send('the requeusted video is not in the queue'));
            })
    },

    createRoom: (req, res, next) => {
        if (!req.body.roomName) return res.status(400).send("no room supplied");
        redisController.createRoom(req.body.roomName)
            .then(() => res.status(200).send('room created'))
            .catch(() => res.status(400).send('that room already exists'));
    },

    getNextVideo: (req, res) => {
        redisController.returnVideo(req.params.room)
            .then(resp => res.status(200).json(resp))
            .catch(() => res.status(400).send('error in getting next video'));
    }

    // setAdmin: (req, res, next) => {
    //   console.log('setting admin for', req.body.roomName);
    //   // res.cookie(`admin${req.body.roomName}`, 'true');
    //   return res.status(200).end('room created');
    //   //re-route to the the room that they created. 
    // },

    // checkAdminCookie: (req, res, next) => {
    //   const cookieStr = `admin${req.body.room}`
    //   if (req.cookie[cookieStr] === true) next();
    //   else return res.status(400).end('must be an admin to remove videos');
    // }


}

module.exports = queueController;