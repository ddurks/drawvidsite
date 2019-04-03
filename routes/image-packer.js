var Rect = {
  
  image: null,

  create: function(x, y, w, h) {
    var rect = Object.create(this);
    rect.size = w * h;
    rect.x = x;
    rect.y = y;
    rect.w = w;
    rect.h = h;
    return rect;
  },

  setImage: function(image) {
    this.image = image;
  }

}

var Node = {

  create: function(rect) {
    var node = Object.create(this);
    node.rect = rect;
    node.left = null;
    node.right = null;
    return node;
  }

}

var ImagePacker = {

  freeRectangles : [],
  placedImageRects: [],
  canvas_h : null,
  canvas_w : null,
  root: null,

  create: function() {
    var tree = Object.create(this);
    tree.root = null;
    return tree;
  },

  pack: function(images, canvas_width, canvas_height) {
    this.canvas_w = canvas_width;
    this.canvas_h = canvas_height;
    for (var i = 0; i < images.length; i++) {
      var node = Node.create(images[i]);
      this.insert(node);
    }
  },

  insert: function(new_node) {
    if (this.root === null) {
      console.log('inserting canvas as root');
      var canvasRect = Rect.create(0, 0, this.canvas_w, this.canvas_h);
      var rootNode = Node.create(null);
      this.freeRectangles.push(canvasRect);
      this.root = rootNode;
    } else {
      var result = this.insertImage(new_node.rect);
    }
    return result;
  },

  insertImage: function(img_rect) {
    if(this.freeRectangles.length === 0) {
      return null;
    }

    console.log('inserting:');
    console.log(img_rect);
    var selectedFreeRect = this.selectFreeRectangle(img_rect);
    if(selectedFreeRect == null) {
      console.log('doesnt fit in any free rects');
      return null;
    } else {
      console.log('placing node in tree:');
      img_rect.x = selectedFreeRect.x;
      img_rect.y = selectedFreeRect.y;
      this.placedImageRects.push(img_rect);
    }
    
    return img_rect;
  },

  getPlacedImageRects: function() {
    return this.placedImageRects;
  },

  selectFreeRectangle: function(img_rect) {
    for(var i = 0; i < this.freeRectangles.length; i++) {
      console.log(this.freeRectangles[i].size + 'vs' + img_rect.size);
      if ( this.freeRectangles[i].size > img_rect.size) {
        console.log('found suitable free rectangle');
        var dw = this.freeRectangles[i].w - img_rect.w;
        var dh = this.freeRectangles[i].h - img_rect.h;
        if(dw >= 0 && dh >= 0) {
          if (dw > dh) {
            console.log('method 1');
            freeRect1 = Rect.create(
              this.freeRectangles[i].x + img_rect.w, 
              this.freeRectangles[i].y, 
              this.freeRectangles[i].w - (this.freeRectangles[i].x + img_rect.w), 
              img_rect.h);
            freeRect2 = Rect.create(
              this.freeRectangles[i].x, 
              this.freeRectangles[i].y + img_rect.h, 
              this.freeRectangles[i].w, 
              this.freeRectangles[i].h - (this.freeRectangles[i].y + img_rect.h));
          } else {
            console.log('method 2');
            freeRect1 = Rect.create(
              this.freeRectangles[i].x + img_rect.w, 
              this.freeRectangles[i].y, 
              this.freeRectangles[i].w - (this.freeRectangles[i].x + img_rect.w), 
              this.freeRectangles[i].h);
            freeRect2 = Rect.create(
              this.freeRectangles[i].x, 
              this.freeRectangles[i].y + img_rect.h, 
              img_rect.w, 
              this.freeRectangles[i].h - (this.freeRectangles[i].y + img_rect.h));
          }
          var selectedRect = this.freeRectangles[i];
          this.freeRectangles.splice(i, 1);
          if (freeRect1.w > 0 && freeRect1.h > 0) {
            console.log('adding...');
            console.log(freeRect1);
            this.freeRectangles.push(freeRect1);
          }
          if (freeRect2.w > 0 && freeRect2.h > 0) {
            console.log('adding...');
            console.log(freeRect2);
            this.freeRectangles.push(freeRect2);
          }
          console.log('FREE RECTS:');
          console.log(this.freeRectangles);
          console.log('PLACED IMAGE RECTS:');
          console.log(this.placedImageRects);
          return selectedRect;
        }
      }
    }
    return null;
  },
}

module.exports = {
  ImagePacker,
  Rect
}
