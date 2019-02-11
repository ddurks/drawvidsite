var express = require('express');
var router = express.Router();
var multer  = require('multer');
var AWS = require('aws-sdk');
var fs = require('fs');
var moment = require('moment');
var twit = require('twit');
const upload = multer({ dest: './uploads' });
var db = require('./db');
var passwordHash = require('./passhash');
var AWScredentials = require('./aws');
var twitconfig = require('./twit');

AWS.config.update({
    accessKeyId: AWScredentials.ACCESSKEY,
    secretAccessKey: AWScredentials.SECRET
});

var s3 = new AWS.S3();

var t = new twit(twitconfig);

function arraysEqual(arr1, arr2) {
    if(arr1.length !== arr2.length) {
        return false;
    }  
    for(var i = arr1.length; i--;) {
        if(arr1[i] !== arr2[i]) {
            return false;
        }
    }
    return true;
}

// GET form for choosing uploads
router.get('/upload-form', function(req, res, next) {
    res.render('upload-form', {});
});

// GET upload page
router.get('/upload-mode', function(req, res, next) {
  res.render('upload-mode', { title: 'drawvid.com: upload' , message: "password:"});
});

// POST check password
router.post('/check-password', function(req, res, next) {
  var passhash = JSON.parse(req.body.passhash);
  if (arraysEqual(passhash, passwordHash)) {
    console.log("success");
    res.render('upload-form', {});
  } else {
    console.log("failure");
    res.send("failure: incorrect password");
  }
});

// POST file upload handler
// ===================
router.post('/upload', upload.single('myFile'), (req, res) => {
  var error = false;
  if (!req.file) {
    console.log('no file uploaded');
    res.redirect('420/upload-mode');

  } else {
    console.log('posting ' + req.file.originalname + '...');
    var tweet_link = null;
    // load uploaded file
    fs.readFile(req.file.path, { encoding: 'base64' }, (err, image_data) => {
      if (err) {
        console.error(err);
        error = true;

      } else {
        // upload media to twitter
        t.post('media/upload', {media: image_data}, function(error, media, response) {
          if (error) {
            console.error(err);
            error = true;

          } else {
            var meta_params = {
              alt_text: { text: req.file.originalname },
              media_id: media.media_id_string
            }
            // create twitter metadata for media
            t.post('media/metadata/create', meta_params, function (err, data, response) {
              if (err) {
                console.error(err);
                error = true;

              } else {
                var params = { status: 'test', media_ids: [media.media_id_string] }
                // post media to twitter
                t.post('statuses/update', params, function (err, tweet, response) {
                  if (err) {
                    console.error(err);
                    error = true;

                  } else {
                    console.log('successsfully tweeted post');
                    tweet_link = tweet.id_str;
                    var params = {
                      Bucket: AWScredentials.S3BUCKET,
                      Key: req.file.originalname,
                      ACL: 'public-read',
                      Body: image_data
                    };
                    // upload to s3 bucket
                    s3.putObject(params, function (perr, pres) {
                      if (perr) {
                        console.error(perr);
                        error = true;
                        
                      } else {
                        console.log('file uploaded successfully to s3');
                        
                        // determine next id number
                        db.one('SELECT * FROM posts ORDER BY id DESC LIMIT 1')
                        .then(function (data) {
                          var nextid = data.id + 1;
                          
                          // add post info to postgres
                          db.one(`INSERT INTO posts (id, image, text, created_date, link) VALUES ( ${nextid}, '${req.file.originalname}', '${req.file.originalname}', '${moment().format()}', 'http://twitter.com/statuses/${tweet_link}' ) RETURNING link`)
                          .then(function (data) {
                            console.log("new post link: " + data.link);
                            fs.unlink(req.file.path, (err) => {
                              if (err) {
                                console.error(err);
                                error = true;

                              } else {
                                console.log( req.file.originalname + ' (' + req.file.path + ') was deleted locally');

                                // render result to webpage
                                if (error) {
                                  res.render('upload-mode', { title: 'drawvid.com: upload' , message: "failure! fuck!"});
                                } else {
                                  res.render('upload-mode', { title: 'drawvid.com: upload' , message: req.file.originalname + ' was successfully uploaded.'});
                                }
                              }
                            });
                          })
                          .catch(function (error) {
                            console.error(error);
                          });
      
                        })
                        .catch(function (error) {
                          console.error(error);
                        });
                      }

                    });
                  }
                  
                });
              }
              
            });
          }
          
        });
      }

    });
  } 
});

module.exports = router;