var express = require('express');
var router = express.Router();
var pgp = require('pg-promise')(/*options*/)

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
