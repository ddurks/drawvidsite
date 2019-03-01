var packer = require('./image-packer');
var probe = require('probe-image-size');

async function generate_gallery(data) {
  var bst = packer.BinarySearchTree.create();
  var imageRects = new Array();
  await Promise.all(data.map(async (element) => {
    var thumb = await probe('https://s3.us-east-2.amazonaws.com/drawvid-thumbnails/thumb-' + element.image);
    var rect = packer.Rect.create(null, null, thumb.width, thumb.height);
    rect.setImage(thumb.url);
    imageRects.push(rect);
    //console.log(rect);
  }));
  //console.log(imageRects);
  return imageRects;
}

module.exports = generate_gallery;
