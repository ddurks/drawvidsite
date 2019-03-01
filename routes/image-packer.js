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
  canvas_h : null,
  canvas_w : null,
  root: null,
  inorder_list: new Array(),

  create: function() {
    var tree = Object.create(this);
    tree.root = null;
    return tree;
  },

  pack: function(images, canvas_width, canvas_height) {
    this.canvas_w = canvas_width;
    this.canvas_h = canvas_height;
    for (var i = 0; i < 5; i++) {
      var node = Node.create(images[i]);
      this.insert(node);
    }
    console.log(this.get_inorder());
  },

  insert: function(new_node) {
    if (this.root === null) {
      console.log('inserting canvas as root');
      var canvasRect = Rect.create(0, 0, this.canvas_w, this.canvas_h);
      var rootNode = Node.create(null);
      this.root = rootNode;
    } else {
      var result = this.insertNode(this.root, new_node);
    }
    return result;
  },

  insertNode: function(node, new_node) {
    var result;
    if (node.left != null) {
      console.log('left');
      result = this.insertNode(node.left, new_node);
      if (result != null) {
        return result;
      } 
    }
    if (node.right != null) {
      console.log('right');
      result = this.insertNode(node.right, new_node);
      if (result != null) {
        return this.insertNode(node.right, new_node);
      }
    } else {
      if(this.freeRectangles.length === 0) {
        return null;
      }

      console.log('evaluating fit');
      if ( (node.image != null) || (node.rect.size < new_node.rect.size) ){
        console.log(node.rect.size, new_node.rect.size);
        console.log('doesnt fit');
        return null;
      }
      if ( node.rect.size === new_node.rect.size ) {
        console.log('perfect fit');
        node = new_node;
        return node;
      } else {
        console.log('splitting');
        var dw = node.rect.w - new_node.rect.w;
        var dh = node.rect.h - new_node.rect.h;
      }

      var freeRect2, freeRect1;
      console.log('INSERTING:');
      console.log(new_node);
      console.log('INTO:');
      console.log(node);
      if (dw > dh && dh > 0) {
        console.log('method 1');
        freeRect1 = Rect.create(
          node.rect.x + new_node.rect.w, 
          node.rect.y, 
          node.rect.w - (node.rect.x + new_node.rect.w), 
          new_node.rect.h);
        freeRect2 = Rect.create(
          node.rect.x, 
          node.rect.y + new_node.rect.h, 
          node.rect.w, 
          node.rect.h - (node.rect.y + new_node.rect.h));
      } else {
        console.log('method 2');
        freeRect1 = Rect.create(
          node.rect.x + new_node.rect.w, 
          node.rect.y, 
          node.rect.w - (node.rect.x + new_node.rect.w), 
          node.rect.h);
        freeRect2 = Rect.create(
          node.rect.x, 
          node.rect.y + new_node.rect.h, 
          new_node.rect.w, 
          node.rect.h - (node.rect.y + new_node.rect.h));
      }

      if (node === this.root) {
        console.log('new root');
        this.root = new_node
      }
      node = new_node;
      node.left = Node.create(null);
      node.right = Node.create(null);
      console.log('parent');
      console.log(node.rect);
      console.log('new left child');
      console.log(node.left.rect);
      console.log('new right child');
      console.log(node.right.rect)
      return node;
    }
  },

  selectRectangle(node) {
    for(var i = 0; i < this.freeRectangles.length; i++) {
      if ( this.freeRectangles[i].size < node.rect.size) {
        
      }
    }
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
          this.inorder_list.push(node.rect);
          this.inorder(node.right);
      }
  },

  get_inorder: function () {
    console.log("INORDER!!!!!!!!!!!")
    console.log(this.root);
    this.inorder(this.root);
    return this.inorder_list;
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
