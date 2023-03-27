const Product = require('../models/product')
const mongoDb = require('mongodb')
exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        formPage: true,
        editing: false
    })
}
exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit
    if (!editMode) {
        return res.redirect('/')
    }
    const { productId } = req.params
    Product.findById(productId)
        .then((product) => {
            if (!product) {
                return res.redirect('/')
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                formPage: true,
                editing: true,
                product
            })
        })
    // Product.findByPk(productId)
    // .then(product => {
    //     if (!product) {
    //         return res.redirect('/')
    //     }
    //     res.render('admin/edit-product', {
    //         pageTitle: 'Edit Product',
    //         path: '/admin/edit-product',
    //         formPage: true,
    //         editing: true,
    //         product
    //     })
    // })
}

exports.postEditProduct = (req, res, next) => {
    const { productId, title, price, description, imageUrl } = req.body
    const prod = new Product(title, price, description, imageUrl, productId)
    prod.save()
        .then(() => {
            res.redirect('/admin/products')
        }).catch(console.log)
    // Product.findByPk(productId).then(product => {
    //     product.title = title;
    //     product.price = price;
    //     product.description = description;
    //     product.imageUrl = imageUrl;
    //     return product.save()
    // }).then(() => {
    //     res.redirect('/admin/products')
    // }).catch(console.log)
    // const updatedProduct = new Product(productId, title, imageUrl, description, price)
    // updatedProduct.save()

}

exports.postDeleteProduct = (req, res, next) => {
    const { productId } = req.body
    Product
        .deleteById(productId)
        .then(() => {
            console.log('Deleted Product');
            res.redirect('/admin/products')
        }).catch(console.log)
    // Product.deleteById(productId)
}

exports.postAddProduct = (req, res, next) => {
    const { imageUrl, title, price, description } = req.body
    const product = new Product(title, price, description, imageUrl, null, req.user._id)
    product.save()
        .then((result) => {
            console.log('Created Product');
            res.redirect('/admin/products')
        }).catch(console.log)
}

exports.getProducts = (req, res, next) => {
    // req.user.getProducts()
    Product.fetchAll()
        .then((products) => {
            res.render('admin/products', {
                prods: products,
                pageTitle: "Admin product",
                path: '/admin/products',
                hasProduct: products.length > 0,
                productPage: true
            })
        }).catch(console.log)
}