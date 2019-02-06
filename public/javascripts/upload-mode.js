function stringToArrayBuffer(string) {
    var encoder = new TextEncoder("utf-8");
    return encoder.encode(string);
};
function arrayBufferToString(array) {
    var decoder = TextDecoder("utf-8");
    return decoder.decode(array);
}
var password;

function upload() {
    password = document.getElementById('textInput').value;

    window.crypto.subtle.digest(
        {
            name: "SHA-512",
        },
        stringToArrayBuffer(password) //The data you want to hash as an ArrayBuffer
    )
    .then(function(hash){
        //returns the hash as an ArrayBuffer
        console.log(new Uint8Array(hash));
        console.log
    })
    .catch(function(err){
        console.error(err);
    });
};


window.onload = async () => {
    upload();
};