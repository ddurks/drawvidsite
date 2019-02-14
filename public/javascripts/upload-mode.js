function stringToArrayBuffer(string) {
    var encoder = new TextEncoder("utf-8");
    return encoder.encode(string);
};
function arrayBufferToString(array) {
    var decoder = new TextDecoder("utf-8");
    return decoder.decode(array);
}

var password;
var tweetCheck = false;
var siteCheck = false;

var replyTweetLink, replyTweetUserName, replyTweetID, tweetText;

$(document).ready(function(){
    $('#uploadButton').click(function() {
        tweetCheck = $('#tweetCheck').prop('checked');
        siteCheck = $('#siteCheck').prop('checked');
        console.log(tweetCheck, siteCheck);
        password = $('#textInput').val();
        replyTweetLink = $('#replyTweetID').val();
        tweetText = $('#tweetText').val();
        var form = $(this);

        var sha512 = new Hashes.SHA512().hex(password); //The data you want to hash as an ArrayBuffer

        console.log(sha512);
        var parts = replyTweetLink.split('/');
        replyTweetUserName = parts[3];
        replyTweetID = parts[5];

        let fetchData = {
            method: 'POST',
            body: JSON.stringify({ passhash : sha512, replyTweetID : replyTweetID, replyTweetUserName : replyTweetUserName, tweetText : tweetText, tweetCheck : tweetCheck, siteCheck : siteCheck }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }
        fetch('check-password', fetchData)
        .then(response => response.text())
        .then(data => {
            console.log(data);
            $('#upload-area').html(data);
        })
        .catch(error => console.error(error));

        if (tweetCheck || siteCheck) {
            console.log('wtf');
        }

        if ( $('#uploadForm').length != 0 && (tweetCheck || siteCheck) ) {
            console.log("submitting image");
            $('#uploadForm').submit();
        }
    });
});