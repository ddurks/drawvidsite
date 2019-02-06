function stringToArrayBuffer(string) {
    var encoder = new TextEncoder("utf-8");
    return encoder.encode(string);
};
function arrayBufferToString(array) {
    var decoder = new TextDecoder("utf-8");
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
        var arrayString = "[";
        var intArray = new Uint8Array(hash);
        for(i = 0; i < intArray.length; i++) {
            arrayString = arrayString + intArray[i] + ", ";
        }
        arrayString = arrayString + "]";

        var currentHash = new Uint8Array(hash);
        console.log(arrayString);
        if (arraysEqual(currentHash, passwordHash)) {
            console.log("success");
        } else {
            console.log(currentHash);
            console.log(passwordHash);
        }
    })
    .catch(function(err){
        console.error(err);
    });
};


window.onload = async () => {
    upload();
};