
const Product = require('../models/product')
const Cart = require('../models/cart')

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/product-list', {
            prods: products,
            pageTitle: "All Product",
            path: '/products',
            hasProduct: products.length > 0,
            productPage: true
        })
    })

    // res.sendFile(path.join(rootDir, 'views', 'shop.html'))
}

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId
    Product.findById(prodId, product => {
        res.render('shop/product-detail', {
            product,
            pageTitle: product.title,
            path: '/products'
        })
    })
    // Product.fetchAll((products) => {
    //     res.render('shop/product-list', {
    //         prods: products,
    //         pageTitle: "All Product",
    //         path: '/products',
    //         hasProduct: products.length > 0,
    //         productPage: true
    //     })
    // })

    // res.sendFile(path.join(rootDir, 'views', 'shop.html'))
}

exports.getIndex = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/index', {
            prods: products,
            pageTitle: "Shopping",
            path: '/',
            hasProduct: products.length > 0,
            productPage: true
        })
    })
}
exports.getCart = (req, res, next) => {
    Cart.getCart((cart) => {
        Product.fetchAll(products => {
            const cartProduct = []
            for (const product of products) {
                const cartProductData = cart.products.find(prod => prod.id == product.id)
                if (cartProductData) {
                    cartProduct.push({
                        productData: product,
                        qty: cartProductData.qty
                    })
                }
            }
            res.render('shop/cart', {
                pageTitle: "Your cart",
                path: '/cart',
                cartProduct
            })
        })

    })

}
exports.postCart = (req, res, next) => {
    const { productId } = req.body
    Product.findById(productId, product => {
        Cart.addProduct(productId, product.price)
    })
    res.redirect('/cart')
}
exports.postCartDeleteProduct = (req, res, next) => {
    const { productId } = req.body
    Product.findById(productId, product => {
        Cart.deleteProduct(productId, product.price)
        res.redirect('/cart')
    })
}
exports.getOrder = (req, res, next) => {
    res.render('shop/orders', {
        pageTitle: "Your Orders",
        path: '/orders',
    })
}

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        pageTitle: "Checkout",
        path: '/checkout',
    })
}