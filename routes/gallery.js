var packer = require('./image-packer');
var probe = require('probe-image-size');

async function generate_gallery(data) {
  var bst = packer.BinarySearchTree.create();
  var imageRects = new Array();
  await Promise.all(data.map(async (element) => {
    var skip = false;
    try {
      var thumb = await probe('https://s3.us-east-2.amazonaws.com/drawvid-thumbnails/thumb-' + element.image);
    } catch(err) {
      //console.error(err);
      skip = true;
    }
    if(!skip) {
      var rect = packer.Rect.create(0, 0, thumb.width, thumb.height);
      rect.setImage(thumb.url);
      imageRects.push(rect);
      //console.log(rect);
    } 
  }));
  //console.log(imageRects);
  packer.BinarySearchTree.pack(imageRects, 500, 500);
  return imageRects;
}

module.exports = generate_gallery;
