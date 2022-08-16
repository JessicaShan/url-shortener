const Express = require('express');
const router = Express.Router();
const shortid = require('shortid');
const shortUrl = require('../models/shortUrl');
const utils = require('../utils/utils');
require('dotenv').config({ path: '../config/.env' });

// Short URL Generator
router.post('/short', async (req, res) => {
  const { full } = req.body;
  const base = process.env.BASE;

  const urlId = shortid.generate();
  if (utils.validateUrl(full)) {
    try {
      let url = await Url.findOne({ full });
      if (url) {
        res.json(url);
      } else {
        const short = `${base}/${urlId}`;

        url = new Url({
          full,
          short,
          urlId,
          date: new Date(),
        });

        await url.save();
        res.json(url);
      }
    } catch (err) {
      console.log(err);
      res.status(500).json('Server Error');
    }
  } else {
    res.status(400).json('Invalid Original Url');
  }
});

module.exports = router;