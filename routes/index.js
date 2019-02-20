var express = require('express');
var router = express.Router();
var db = require('./db');

var most_recent_postnum = 0;

/* GET site pages */
/*================*/

// GET home page
router.get('/', function(req, res, next) {
  
  db.one('SELECT * FROM posts ORDER BY id DESC LIMIT 1')
  .then(function (data) {
    res.render('index', { title: 'drawvid.com: home', imagename: 'https://s3.amazonaws.com/drawvid-posts/' + data.image });
  })
  .catch(function (error) {
    console.log('ERROR:', error);
  });
});
// GET about page
router.get('/about', function(req, res, next) {
  res.render('about', { title: 'drawvid.com: about' });
});
// GET etc page
router.get('/etc', function(req, res, next) {
  res.render('etc', { title: 'drawvid.com: etc' });
});

router.get('/small-man', function(req, res, next) {
  res.render('small-man', { title: 'drawvid.com: small-man' });
});

/* GET current post number. */
router.get('/most_recent_post', function(req, res, next) {
  
  db.one('SELECT * FROM posts ORDER BY id DESC LIMIT 1')
  .then(function (data) {
    var id = data.id;
    var img = data.image;
    var txt = data.text;
    var link = data.link;
    var date = data.created_date;
    most_recent_postnum = id;
    res.json({"current_num": id, "image" : img, "text" : txt, "link": link, "date" : date});
  })
  .catch(function (error) {
    console.log('ERROR:', error);
  });
});

/* Display specific post */
router.get('/post', function(req, res, next) {
  
  console.log(req.query.name);
  db.one("SELECT * FROM POSTS WHERE id='" + req.query.name + "'")
  .then(function (data) {
    var id = data.id;
    var img = data.image;
    var txt = data.text;
    var link = data.link;
    var date = data.created_date;
    res.json({"id": id, "image" : img, "text" : txt, "link": link, "date" : date});
  })
  .catch(function (error) {
    console.log('ERROR:', error);
  });
});

/* GET random drawing for home page. */
router.get('/random', function(req, res, next) {
  var random_postnum = Math.floor((Math.random() * most_recent_postnum));
  console.log(random_postnum);
  
  db.one('SELECT * FROM POSTS WHERE id=' + random_postnum)
  .then(function (data) {
    var id = data.id;
    var img = data.image;
    var txt = data.text;
    var link = data.link;
    var date = data.created_date;
    res.json({"id": id, "image" : img, "text" : txt, "link": link, "date" : date});
  })
  .catch(function (error) {
    console.log('ERROR:', error)
  });
});

router.get('/prev', function(req, res, ext) {
  var prev_post_num = Number(req.query.curr) - 1;
  db.one('SELECT * FROM POSTS WHERE id=' + prev_post_num)
  .then(function (data) {
    var id = data.id;
    var img = data.image;
    var txt = data.text;
    var link = data.link;
    var date = data.created_date;
    res.json({"id": id, "image" : img, "text" : txt, "link": link, "date" : date});
  })
  .catch(function (error) {
    console.log('ERROR:', error)
  });
});

router.get('/next', function(req, res, ext) {
  var next_post_num = Number(req.query.curr) + 1;
  db.one('SELECT * FROM POSTS WHERE id=' + next_post_num)
  .then(function (data) {
    var id = data.id;
    var img = data.image;
    var txt = data.text;
    var link = data.link;
    var date = data.created_date;
    res.json({"id": id, "image" : img, "text" : txt, "link": link, "date" : date});
  })
  .catch(function (error) {
    console.log('ERROR:', error);
  });
});

module.exports = router;
