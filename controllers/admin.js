const Product = require('../models/product')
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
    Product.findById(productId, product => {
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
}

exports.postEditProduct = (req, res, next) => {
    const { productId, title, price, description, imageUrl } = req.body
    const updatedProduct = new Product(productId, title, imageUrl, description, price)
    updatedProduct.save()
    res.redirect('/admin/products')
}

exports.postDeleteProduct = (req, res, next) => {
    const { productId } = req.body
    Product.deleteById(productId)
    res.redirect('/admin/products')
}

exports.postAddProduct = (req, res, next) => {
    const { imageUrl, title, price, description } = req.body
    const product = new Product(null, title, imageUrl, description, price)
    product.save()
    res.redirect('/')
}

exports.getProduct = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('admin/products', {
            prods: products,
            pageTitle: "Admin product",
            path: '/admin/products',
            hasProduct: products.length > 0,
            productPage: true
        })
    })
}