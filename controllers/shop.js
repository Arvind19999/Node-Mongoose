const Product = require('../models/product');
// const Cart = require('../models/cart');
const Order = require('../models/order')
exports.getProducts = (req, res, next) => {
  Product.find()
  // .select('title price')
  //   .populate('userId','name')
    .then(prodcuts => {
      // console.log(prodcuts)
      res.render('shop/product-list', {
        prods: prodcuts,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch(err => {
      console.log(err)
    })
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => {
      console.error(err)
    });
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      })
    })
    .catch(err => {
      console.log(err)
    })
};

exports.getCart = (req, res, next) => {
  req.user.populate('cart.items.productId')
  // .execPopulate()
    .then(results => {
      const products = results.cart.items
          res.render('shop/cart', {
            path: '/cart',
            pageTitle: 'Your Cart',
            products: products
          });
        // }).catch(err => {
        //   console.log(err)
        // })
    })
    .catch(err => {
      console.log(err)
    })
}

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
  .then(product =>{
    return req.user.addToCart(product)
  })
  .then(result=>{
    console.log(result)
    res.redirect('/cart')
  })
  .catch(err=>{
    console.log(err)
  })


  // let newQuantity = 1
  // let fetchedCart;
  // req.user.getCart()
  //   .then(cart => {
  //     fetchedCart = cart
  //     return cart.getProducts({
  //       where: {
  //         id: prodId
  //       }
  //     })
  //   }).then(products => {
  //     let product;
  //     if (products.length > 0) {
  //       product = products[0]
  //     }
  //     if (product) {
  //       const oldQunatity = product.cartItem.quantity
  //       newQuantity = oldQunatity + 1
  //       return product
  //     }
  //     return Product.findByPk(prodId)
  //   })
  //   .then(product => {
  //     console.log("This is the begining")
  //     console.log(product)
  //     return fetchedCart.addProduct(product, {
  //       through: {
  //         quantity: newQuantity
  //       }
  //     })
  //   })
  //   .then(() => {
  //     res.redirect('/cart');
  //   })
  //   .catch(err => {
  //     console.log(err)
  //   })
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.deleteCartItems(prodId)
.then(result=>{
  console.log(result)
    res.redirect('/cart');
  })
  .catch(err=>{
    console.log(err)
  })
};

exports.postOrders =(req,res,next)=>{
  // let fetchedCart;
  req.user.populate('cart.items.productId')
  .then(user=>{
    const products = user.cart.items.map(i=>{
      return {quantity : i.quantity, product:{...i.productId._doc} }
    });
    const order = new Order({
      user : {
        userId : req.user,
        name : req.user.name,
        email : req.user.email,
        phoneNum  : req.user.phoneNum
      },
      products : products
    })
    order.save()
  })
  .then(results=>{
    return req.user.clearCartItems()
    
  }).then(r=>{
    res.redirect('/orders')
  })
  .catch(err=>{
    console.log(err)
  })
}

exports.getOrders = (req, res, next) => {
  Order.find({'user.userId':req.user._id})
.then(orders=>{
  res.render('shop/orders', {
  path: '/orders',
  pageTitle: 'Your Orders',
  orders : orders
});
})
.catch(err=>{
  console.log(err)
})
};



// exports.getCheckout = (req, res, next) => {
//   res.render('shop/checkout', {
//     path: '/checkout',
//     pageTitle: 'Checkout'
//   });
// };