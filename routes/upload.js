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
const DB_NAME = 'testposts';

AWS.config.update({
    accessKeyId: AWScredentials.ACCESSKEY,
    secretAccessKey: AWScredentials.SECRET
});

var s3 = new AWS.S3();

var t = new twit(twitconfig);

var drawvidpost = {
  filename : "",
  text: "",
  link: "",
  date: "",
  upload_path: ""
}

var tweetCheck = false;
var siteCheck = false;

var tweetText = "";
var replyTweetID = "";
var replyTweetUserName = "";

// GET form for choosing uploads
router.get('/upload-form', function(req, res, next) {
    res.render('upload-form', {});
});

// GET upload page
router.get('/upload-mode', function(req, res, next) {
  res.render('upload-mode', { title: 'drawvid.com: upload' , message: "password*:"});
});

// POST check password
router.post('/check-password', function(req, res, next) {
  tweetText = req.body.tweetText;
  replyTweetID = req.body.replyTweetID;
  if (req.body.replyTweetUserName != null) {
    replyTweetUserName = "@" + req.body.replyTweetUserName + " ";
  }
  var passhash = req.body.passhash;
  tweetCheck = req.body.tweetCheck;
  siteCheck = req.body.siteCheck;

  if (passhash === passwordHash) {
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
    console.log('received: ' + drawvidpost.filename );
    drawvidpost.filename = req.file.originalname;
    if (tweetText != "") {
      drawvidpost.text = tweetText;
    } else {
      drawvidpost.text = drawvidpost.filename;
    }
    drawvidpost.date = moment().format();
    drawvidpost.upload_path = req.file.path;
    var success_string = "";
    var failure_string = "";
    
    if (tweetCheck) {
      if (uploadToTwitter()) {
        success_string += "twitter ";
      } else {
        failure_string += "twitter ";
      }
    }
    if (siteCheck) {
      if (uploadToWebsite()) {
        success_string += "site ";
      } else {
        failure_string += "site ";
      }
    } 
    
    res.render('upload-mode', { title: 'drawvid.com: upload' , message: success_string + " | " + failure_string});
  } 
});

function uploadToTwitter() {
  console.log('tweeting...');
  // load uploaded file
  fs.readFile(drawvidpost.upload_path, { encoding: 'base64' }, (err, image_data) => {
    if (err) {
      console.error(err);
      return false;

    } else {
      // upload media to twitter
      t.post('media/upload', {media: image_data}, function(error, media, response) {
        if (error) {
          console.error(err);
          return false;

        } else {
          var meta_params = {
            alt_text: { text: drawvidpost.filename },
            media_id: media.media_id_string
          }
          // create twitter metadata for media
          t.post('media/metadata/create', meta_params, function (err, data, response) {
            if (err) {
              console.error(err);
              return false;

            } else {
              var params = { 
                status: replyTweetUserName + tweetText, 
                media_ids: [media.media_id_string],
                in_reply_to_status_id: "" + replyTweetID
              }
              // post media to twitter
              t.post('statuses/update', params, function (err, tweet, response) {
                if (err) {
                  console.error(err);
                  return false;

                } else {
                  console.log('successsfully tweeted!');
                  drawvidpost.link = 'http://twitter.com/statuses/' + tweet.id_str;
                  return true;
                }
                
              });
            }
            
          });
        }
        
      });
    }

  });
}

function uploadToWebsite() {
  console.log("uploading to db and s3...")
  fs.readFile(drawvidpost.upload_path, (err, image_data) => {
    if (err) {
      console.error(err);
      return false;

    } else {
      var filenamelist = drawvidpost.filename.split('.');
      var params = {
        Bucket: AWScredentials.S3BUCKET,
        Key: drawvidpost.filename,
        ACL: 'public-read',
        Body: image_data,
        ContentType: ('image/' + filenamelist[1])
      };
      // upload to s3 bucket
      s3.putObject(params, function (perr, pres) {
        if (perr) {
          console.error(perr);
          return false;
          
        } else {
          console.log('file uploaded successfully to ' + AWScredentials.S3BUCKET + '!');
          
          // determine next id number
          db.one(`SELECT * FROM ${DB_NAME} ORDER BY id DESC LIMIT 1`)
          .then(function (data) {
            var nextid = data.id + 1;
            
            // add post info to postgres
            db.one(`INSERT INTO ${DB_NAME} (id, image, text, created_date, link) VALUES ( ${nextid}, '${drawvidpost.filename}', '${drawvidpost.text}', '${drawvidpost.date}', '${drawvidpost.link}' ) RETURNING link`)
            .then(function (data) {
              console.log("new post link: " + data.link);
              fs.unlink(drawvidpost.upload_path, (err) => {
                if (err) {
                  console.error(err);
                  return false;

                } else {
                  console.log('file uploaded successfully to ' + DB_NAME + '!');
                  console.log( drawvidpost.filename + ' (' + drawvidpost.upload_path + ') was deleted locally');
                  return true;
                }
              });
            })
            .catch(function (error) {
              console.error(error);
              return false;
            });

          })
          .catch(function (error) {
            console.error(error);
            return false;
          });
        }

      });
    }
  });
}
module.exports = router;