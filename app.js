const express = require('express');
const router = express.Router();
require('./config/mongoose')

const exphbs = require('express-handlebars') // 樣板引擎指定為 Handlebars
const qs = require('querystring');

const validUrl = require('valid-url');
const shortid = require('shortid');

// creating express route handler
const app = express()
const PORT = process.env.PORT || 3000  // 環境使用 process.env.PORT 或本地環境3000 

const ShortUrl = require('./models/shortUrl')

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.get('/', async (req, res) => {
  const shortUrls = await ShortUrl
  .find()
  .lean()
  res.render('index', { shortUrls: shortUrls })
})

app.get('/:shortUrl', async (req, res) => {
  const query = ShortUrl
  .findOne({ urlId: req.params.shortUrl });
  query.then(function (shortUrl) {
    if (shortUrl instanceof ShortUrl) {
      // already saved, just return
      shortUrl.clicks++
      shortUrl.save()

      res.redirect(shortUrl.full)
    } else {
      return res.sendStatus(404)
    }
  })
})

app.post('/shortUrls', async (request, response) => {
  if (request.method == 'POST') {
    let body = '';

    request.on('data', function (data) {
      body += data;

      // Too much POST data, kill the connection!
      // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
      if (body.length > 1e6)
        request.connection.destroy();
    });

    request.on('end', function () {
      const post = qs.parse(body);
      const fullUrl = post.fullUrl;

      // create url id
      let urlId = shortid.generate().substring(0, 5);

      // check long url
      if (validUrl.isUri(fullUrl)) {
        try {
          const query = ShortUrl.findOne({ full: fullUrl });
          query.then(function (url) {
            if (url instanceof ShortUrl) {
              response.redirect("/");
            } else {
              // create
              const short = "http://localhost" + '/' + urlId;

              const shortUrl = new ShortUrl({
                urlId: urlId,
                full: fullUrl,
                short: short
              });
              shortUrl.save();
              response.redirect("/");
            }
          });
        } catch (error) {
          console.log(error);
          response.status(500).json('server error');
        }
      } else {
        response.status(401).json('Invalid long url');
      }
    });
  }
});

app.listen(PORT, () => {    // 設定應用程式監聽的埠號
  console.log(`App is running on http://localhost:${PORT}`)
})
