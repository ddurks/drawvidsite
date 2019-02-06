function stringToArrayBuffer(string) {
    var encoder = new TextEncoder("utf-8");
    return encoder.encode(string);
};
function arrayBufferToString(array) {
    var decoder = new TextDecoder("utf-8");
    return decoder.decode(array);
}
function arraysEqual(arr1, arr2) {
    if(arr1.length !== arr2.length)
        return false;
    for(var i = arr1.length; i--;) {
        if(arr1[i] !== arr2[i])
            return false;
    }
  
    return true;
  }

var passwordHash = new Uint8Array([246, 176, 40, 61, 226, 146, 153, 234, 219, 213, 198, 246, 137, 87, 78, 149, 181, 90, 33, 83, 62, 67, 245, 142, 44, 166, 98, 53, 202, 1, 117, 199, 147, 23, 53, 132, 71, 43, 210, 17, 169, 207, 225, 233, 216, 198, 111, 61, 120, 19, 183, 217, 164, 93, 200, 147, 203, 121, 94, 108, 232, 201, 232, 121]);
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