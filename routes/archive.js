var express = require('express');
var router = express.Router();
var db = require('./db');

/* GET archive page. */
router.get('/', function(req, res, next) {
  res.render('archive', { title: 'drawvid.com: archive' });
});

/* GET all posts.*/
router.get('/allposts', function(req, res, next) {
  
  db.query('SELECT * FROM posts')
  .then(function (data) {
    res.send(data);
  })
  .catch(function (error) {
    console.log('ERROR:', error);
  });
  
});

module.exports = router;
