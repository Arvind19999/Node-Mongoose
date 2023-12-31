  const Product = require('../models/product')
  exports.getAddProducts = (req, res, next) => {
      res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true,
        editing : false
      });
    }

  exports.postAddproduct = (req, res, next) => {
      // products.push({ title: req.body.title });
      const title = req.body.title
      const imageUrl = req.body.imageUrl
      const price = req.body.price
      const description = req.body.description

      const product = new Product(null,title,imageUrl,price,description)
      product.save()
      res.redirect('/');
    }

    exports.geteditProduct = (req, res, next) => {
      const editMode = req.query.edit
      if(!editMode){
        return res.redirect('/')
      }
      prodId = req.params.prodId
      Product.findById(prodId,product=>{
        res.render('admin/edit-product', {
          pageTitle: 'Add Product',
          path: '/admin/edit-product',
          editing : editMode,
          product:product
        });
      })
    }

    exports.postEditproduct = (req,res,next)=>{
      const prodId = req.body.productId
      const updatedTitle = req.body.title
      const updatedimageUrl = req.body.imageUrl
      const updatedPrice = req.body.price
      const updatedDescription = req.body.description
      // const updatedTitle = req.body.title
      const updatedProduct = new Product(
        prodId,
        updatedTitle,
        updatedimageUrl,
        updatedPrice,
        updatedDescription)

        updatedProduct.save()
        console.log(updatedProduct)
        res.redirect('/products')
    } 


    exports.getProducts = (req,res,next)=>{
      Product.fetchAll(products=>{
          res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/products',
          });
        })
    }


  exports.deleteProduct = (req,res,next)=>{
    const prodId = req.body.prodDeleteId
    Product.deleteById(prodId)
    res.redirect('/admin/products')

  }
