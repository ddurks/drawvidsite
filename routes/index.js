var express = require('express');
var router = express.Router();
var db = require('./db');

var r_p = 0;

/* GET home page. */
router.get('/', function(req, res, next) {
  
  db.one('SELECT * FROM posts ORDER BY id DESC LIMIT 1')
  .then(function (data) {
    console.log('DATA:', data.image)
    res.render('index', { title: 'drawvid.com: home', imagename: 'https://s3.amazonaws.com/drawvid-posts/' + data.image });
  })
  .catch(function (error) {
    console.log('ERROR:', error);
  });
});

/* GET about page. */
router.get('/about', function(req, res, next) {
  res.render('about', { title: 'drawvid.com: about' });
});
/* GET archive page. */
router.get('/archive', function(req, res, next) {
  res.render('archive', { title: 'drawvid.com: archive' });
});
/* GET misc page. */
router.get('/misc', function(req, res, next) {
  res.render('misc', { title: 'drawvid.com: misc' });
});

/* GET current post number. */
router.get('/current_post', function(req, res, next) {
  
  db.one('SELECT * FROM posts ORDER BY id DESC LIMIT 1')
  .then(function (data) {
    r_p = data.id;
    res.json({"current_num": r_p});
  })
  .catch(function (error) {
    console.log('ERROR:', error);
  });
});


/* GET random drawing for home page. */
router.get('/random', function(req, res, next) {
  var random_postnum = Math.floor((Math.random() * r_p));
  
  db.one('SELECT * FROM POSTS WHERE id=' + random_postnum)
  .then(function (data) {
    console.log('DATA:', data.image)
    res.json({ "link":"https://s3.amazonaws.com/drawvid-posts/" + data.image, "num": data.id });
  })
  .catch(function (error) {
    console.log('ERROR:', error)
  });
});

router.get('/prev', function(req, res, ext) {
  var prev_post_num = Number(req.query.curr) - 1;
  db.one('SELECT * FROM POSTS WHERE id=' + prev_post_num)
  .then(function (data) {
    console.log('DATA:', data.image)
    res.json({ "link":"https://s3.amazonaws.com/drawvid-posts/" + data.image, "num": data.id });
  })
  .catch(function (error) {
    console.log('ERROR:', error)
  });
});

router.get('/next', function(req, res, ext) {
  var next_post_num = Number(req.query.curr) + 1;
  db.one('SELECT * FROM POSTS WHERE id=' + next_post_num)
  .then(function (data) {
    console.log('DATA:', data.image)
    res.json({ "link":"https://s3.amazonaws.com/drawvid-posts/" + data.image, "num": data.id });
  })
  .catch(function (error) {
    console.log('ERROR:', error)
  });
});

module.exports = router;
