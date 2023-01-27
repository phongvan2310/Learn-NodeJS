const express = require('express')
const router = express.Router()
const path = require('path')
const rootDir = require('../utils/path')
const products = []

router.get('/add-product', (req, res, next) => {
    res.render('add-product', {
        pageTitle: 'Add Product',
        path: 'admin/add-product',
        formPage: true,
    })
    // res.sendFile(path.join(rootDir, 'views', 'add-product.html'))
})

router.post('/add-product', (req, res, next) => {
    console.log(req.body);
    products.push({ title: req.body.title })
    res.redirect('/')
});

exports.routes = router
exports.products = products