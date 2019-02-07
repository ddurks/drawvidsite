var express = require('express');
var multer  = require('multer');
var router = express.Router();
var db = require('./db');
var passwordHash = require('./passhash');

var r_p = 0;

function arraysEqual(arr1, arr2) {
  if(arr1.length !== arr2.length)
      return false;
  for(var i = arr1.length; i--;) {
      if(arr1[i] !== arr2[i])
          return false;
  }

  return true;
}

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
// GET small-man.js
router.get('/small-man', function(req, res, next) {
  res.render('small-man', { title: 'drawvid.com: small-man' });
});
router.get('/69/upload-mode', function(req, res, next) {
  res.render('upload-mode', { title: 'drawvid.com: upload' });
});
router.post('/check-password', function(req, res, next) {
  var passhash = JSON.parse(req.body.passhash);
  if (arraysEqual(passhash, passwordHash)) {
    console.log("success");
    res.json({"success":true});
  } else {
    console.log("failure");
    res.json({"success":false});
  }
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

/* Display specific post */
router.get('/post', function(req, res, next) {
  
  console.log(req.query.name);
  db.one("SELECT * FROM POSTS WHERE image='" + req.query.name + "'")
  .then(function (data) {
    res.render('index', { title: 'drawvid.com: ' + req.query.name, imagename: 'https://s3.amazonaws.com/drawvid-posts/' + data.image });
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
    res.json({ "link":"https://s3.amazonaws.com/drawvid-posts/" + data.image, "num": data.id });
  })
  .catch(function (error) {
    console.log('ERROR:', error)
  });
});

module.exports = router;
