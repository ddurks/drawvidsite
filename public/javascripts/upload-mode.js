var HOST = 'http://localhost:3000/'
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
            arrayString = arrayString + intArray[i];
            if (i != intArray.length - 1) {
                arrayString = arrayString + ", ";
            }
        }
        arrayString = arrayString + "]";

        let fetchData = {
            method: 'POST',
            body: JSON.stringify({ passhash : arrayString }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }
        fetch(HOST + 'check-password', fetchData)
        .then(response => response)
        .then(data => {
            console.log(data);
        })
        .catch(error => console.error(error));
    })
    .catch(function(err){
        console.error(err);
    });
};


window.onload = async () => {
    upload();
};