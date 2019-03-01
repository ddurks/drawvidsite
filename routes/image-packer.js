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

var BinarySearchTree = {

  freeRectangles : [],
  imageRectangles : [],
  canvas_h : null,
  canvas_w : null,

  create: function() {
    var tree = Object.create(this);
    tree.root = null;
    return tree;
  },

  pack: function(images, canvas_width, canvas_height) {
    this.canvas_w = canvas_width;
    this.canvas_h = canvas_height;
    for (var i = 0; i < images.length; i++) {
      var rect = Rect.create(null, null, images[i].width, images[i].height);
      this.imageRectangles[i] = rect;
    }
    console.log(this.imageRectangles);
  },

  insert: function(node) {
    var new_node = Node.create(node);

    if (this.root === null) {
      this.root = new_node;
    } else {
      this.insertNode(this.root, new_node);
    }
  },

  insertNode: function(node, new_node) {
    var result;
    if (node.left != null) {
      result = this.insertNode(node.left, new_node);
      if (result != null) {
        return result;
      } 
    } else if (node.right != null) {
      result = this.insertNode(node.right, new_node);
      if (result != null) {
        return this.insertNode(node.right, new_node);
      }
    } else {
      if ( (node.image != null) || (node.rect.size < new_node.rect.size) ){
        return null;
      }
      if ( node.rect.size === new_node.rect.size ) {
        node = new_node;
        return node;
      } else {
        var dw = node.rect.w - new_node.rect.w;
        var dh = node.rect.h - new_node.rect.h;
      }
    }
    /*
    if(new_node.rect.size() < node.rect.size()) {
      if(node.left === null) {
        node.left = new_node;
      } else {
        this.insertNode(node.left, new_node);
      }
    } else {
      if(node.right === null) {
        node.right = new_node;
      } else {
        this.insertNode(node.right, new_node);
      }
    }
    */
  },

  remove: function(node) {
    this.root = removeNode(this.root, node);
  },

  removeNode: function(node, key) {
    if(node === null) {
      return null;
    }
    if(key < node.rect) {
      node.left = this.removeNode(node.left, key);
      return node;
    } else if(key > node.rect) {
      node.right = this.removeNode(node.right, key);
      return node;
    } else {
      if (node.left === null && node.right === null) {
        node = null;
        return node;
      }
      if (node.left === null) {
        node = node.left;
        return node;
      } else if (node.right === null) {
        node = node.right;
        return node;
      }
      var aux = this.findMinNode(node.right);
      node.rect = aux.rect;

      node.right = this.removeNode(node.right, aux.rect);
      return node;
    }

  },

  inorder: function(node) { 
      if(node !== null)
      {
          this.inorder(node.left);
          console.log(node.rect);
          this.inorder(node.right);
      }
  },

  preorder: function(node) { 
    if(node !== null)
    {
        console.log(node.rect);
        this.preorder(node.left);
        this.preorder(node.right);
    }
  },

  postorder: function(node) {
    if(node !== null)
    {
        this.postorder(node.left);
        this.postorder(node.right);
        console.log(node.rect);
    }
  },

  findMinNode: function(rect) {
    if(node.left === null) {
        return node;
    }
    else {
        return this.findMinNode(node.left);
    }
  },

  getRootNode: function() {
    return this.root;
  }
}

module.exports = {
  BinarySearchTree,
  Rect
}
