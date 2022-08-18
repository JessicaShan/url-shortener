const mongoose = require('mongoose')

const shortUrlSchema = new mongoose.Schema({
  urlId: {
    type: String,
    required: true,
  },
  full: {
    type: String,
    required: true
  },
  short: {
    type: String,
    required: true,
    default: " "
  },
  clicks: {
    type: Number,
    required: true,
    default: 0
  }
})

module.exports = mongoose.model('shortUrl', shortUrlSchema);