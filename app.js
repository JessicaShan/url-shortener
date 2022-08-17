const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const exphbs = require('express-handlebars') // 樣板引擎指定為 Handlebars
const qs = require('querystring');

const validUrl = require('valid-url')
const shortid = require('shortid')
// creating express route handler

const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})
const app = express()

const PORT = process.env.PORT || 3000  // 環境使用 process.env.PORT 或本地環境3000 

const ShortUrl = require('./models/shortUrl')
// // const fullUrl = require('../../models/Url')
mongoose.connect(process.env.MONGODB_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
});

// mongoose.connect('mongodb://localhost/url-shortener', {
//   useNewUrlParser: true, useUnifiedTopology: true
// })

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
// app.use(express.urlencoded({ extended: false }))

// app.get('/', (req, res) => {
//   res.render('index')
// })
app.get('/', async (req, res) => {
  const shortUrls = await ShortUrl.find().lean();
  res.render('index', { shortUrls: shortUrls })
})

// app.post('/shortUrls', (req, res) => {

//   const fullUrl = FullUrl(req.body.fullUrl);
//   console.log(req.body)
//   // await ShortUrl.create({ full: req.body.fullUrl })
//   ShortUrl.create({ full: fullFull})
//     .then((data) => res.send(data))
//     .then((date) => res.redirect('/'))
//     .catch(error => console.log(error))
// })
// app.get("/:shortUrl", (req, res) => {
//   ShortUrl.findOne({ short: req.params.shortUrl })
//     .then((url) => res.redirect(url.full))
//     .catch(() => res.send("輸入有效的網址"));
// });

app.get('/:shortUrl', async (req, res) => {
  const query = ShortUrl.findOne({ urlId: req.params.shortUrl });
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
      const urlId = shortid.generate();

      // check long url
      if (validUrl.isUri(fullUrl)) {
        try {
          const query = ShortUrl.findOne({ full: fullUrl });
          query.then(function (url) {
            if (url instanceof ShortUrl) {
              // already saved, just return
              response.redirect("/");
            } else {
              // create
              const short = "http://localhost" + '/' + urlId;

              shortUrl = new ShortUrl({
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
