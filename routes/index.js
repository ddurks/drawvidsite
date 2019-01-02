var express = require('express');
var router = express.Router();
var pgp = require('pg-promise')(/*options*/)

const databaseConfig= {
  host: 'drawviddb.cdmlgyhqifrq.us-east-1.rds.amazonaws.com',
  port: 5432,
  database: 'drawvidposts',
  user: 'drawvid',
  password: 'Ilovemymom'
};
var db = pgp(databaseConfig)

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'drawvid.com: home', imagename: 'WaterMainpng.png' });
  
  db.one('SELECT * FROM POSTS')
  .then(function (data) {
    console.log('DATA:', data.text)
  })
  .catch(function (error) {
    console.log('ERROR:', error)
  });
});

module.exports = router;
