var HOST = 'http://drawvid.com/'
function stringToArrayBuffer(string) {
    var encoder = new TextEncoder("utf-8");
    return encoder.encode(string);
};
function arrayBufferToString(array) {
    var decoder = new TextDecoder("utf-8");
    return decoder.decode(array);
}

var password;

var replyTweetLink, replyTweetUserName, replyTweetID, tweetText;

$(document).ready(function(){
    $('#uploadButton').click(function() {
        if ( $('#uploadForm').length != 0 ) {
            console.log("submitting image");
            $('#uploadForm').submit();
        }
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
            body: JSON.stringify({ passhash : sha512, replyTweetID : replyTweetID, replyTweetUserName : replyTweetUserName, tweetText : tweetText }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }
        fetch(HOST + '420/check-password', fetchData)
        .then(response => response.text())
        .then(data => {
            console.log(data);
            $('#upload-area').html(data);
        })
        .catch(error => console.error(error));

    });
});