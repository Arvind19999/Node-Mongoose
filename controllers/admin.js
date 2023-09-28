const mongodb = require('mongodb'); 

const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/edit-products',
    editing: false
  });
  
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const descriptions = req.body.descriptions;
  const userId = req.user
  const product = new Product({title:title,imageUrl:imageUrl,price:price,descriptions:descriptions,userId:userId});
  product.save()
  .then(result=>{
    // console.log("Resultss")
    // console.log(result)
    res.redirect('/admin/products');
  }).catch(err=>{
    console.log(err)
  })

};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  // req.user.getProducts({where:{id:prodId}})
  Product.findById(prodId)
  .then(product=>{
      if (!product) {
      return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product
      });  
  })
  .catch(err=>{
    console.log(err)
  })
};


exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.descriptions;
  // const product = new Product(updatedTitle,updatedImageUrl,updatedPrice,updatedDesc,new mongodb.ObjectId(prodId))
  Product.findById(prodId)
  .then(product=>{
    product.title = updatedTitle;
    product.imageUrl = updatedImageUrl;
    product.price = updatedPrice;
    product.descriptions = updatedDesc;
    return product.save()
  }).then(result=>{
      // console.log("Product Updated Successfully")
      res.redirect('/admin/products')
  })
    .catch(err=>{
      console.log(err)
    })
};

exports.getProducts = (req, res, next) => {
  // req.user.getProducts()
  Product.find()
  .then(products=>{
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  })
  .catch(err=>{
    console.log(err)
  })
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  Product.findOneAndRemove(prodId)
 .then(result=>{
    console.log("Product Deleted Successfully")
    res.redirect('/admin/products')
  })
  .catch(err=>{
    console.log(err)
  })
  // res.redirect('/admin/products');
};
