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
        return res.status(200).json(data)
      });
  },

  addToQueue: (req, res, next) => {
    if (!req.body.link) return res.status(400).send("no link supplied").end();
    if (!req.body.room) return res.status(400).send("no room supplied").end();
    if (!matchYoutubeUrl(req.body.link)) return res.status(400).send("invalid youtube url").end();
    redisController.roomExists(req.body.room)
      .then((exists) => {
        if (!exists) {
          return res.status(400).send("that room doesn't exist").end();
        }
        redisController.addVideo(req.body.room, req.body.link)
          .then(() => {
            next();
          })
          .catch(() => res.status(400).send('the requeusted video is already queued').end());
      })
  },

  removeFromQueue: (req, res, next) => {
    if (!req.body.link) return res.status(400).send("no link supplied").end();
    if (!req.body.room) return res.status(400).send("no room supplied").end();
    if (!matchYoutubeUrl(req.body.link)) return res.status(400).send("invalid youtube url").end();
    redisController.roomExists(req.body.room)
      .then((exists) => {
        if (!exists) {
          return res.status(400).send("that room doesn't exist").end();
        }
        redisController.removeFromQueue(req.body.room, req.body.link)
          .then(() => {
            next();
          })
          .catch(() => res.status(400).send('the requeusted video is not in the queue').end());
      })
  },
}

module.exports = queueController;