
const Product = require('../models/product')
const Order = require('../models/order')

exports.getProducts = (req, res, next) => {
    Product.findAll().then((products) => {
        console.log(products);
        res.render('shop/product-list', {
            prods: products,
            pageTitle: "All Product",
            path: '/products',
            hasProduct: products.length > 0,
            productPage: true
        })
    }).catch(console.log)
}

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId
    // Product.findAll({
    //     where: {
    //         id: prodId
    //     }
    // }).then((products) => {
    //     res.render('shop/product-detail', {
    //         product: products[0],
    //         pageTitle: products[0].title,
    //         path: '/products'
    //     })
    // }).catch(console.log)
    Product.findByPk(prodId).then((product) => {
        res.render('shop/product-detail', {
            product: product,
            pageTitle: product.title,
            path: '/products'
        })
    }).catch(console.log)
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
    Product.findAll().then(products => {
        console.log(products);
        res.render('shop/index', {
            prods: products,
            pageTitle: "Shopping",
            path: '/',
            hasProduct: products.length > 0,
            productPage: true
        })
    }).catch(console.log)
    // Product.fetchAll().then(([products]) => {
    //     res.render('shop/index', {
    //         prods: products,
    //         pageTitle: "Shopping",
    //         path: '/',
    //         hasProduct: products.length > 0,
    //         productPage: true
    //     })
    // }).catch(console.log)

}
exports.getCart = (req, res, next) => {
    req.user.getCart()
        .then(cart => cart.getProducts())
        .then(products => {
            console.log(products)
            res.render('shop/cart', {
                pageTitle: "Your cart",
                path: '/cart',
                cartProduct: products
            })
        })
        .catch(console.log)
}
exports.postCart = (req, res, next) => {
    const { productId } = req.body
    let fetchedCart;
    req.user.getCart()
        .then(cart => {
            fetchedCart = cart
            return cart.getProducts({ where: { id: productId } })
        }).then(([product]) => {
            if (product) {
                const oldQuantity = product.cartItem.quantity
                return [product, oldQuantity + 1]
            }
            return Product.findByPk(productId)
                .then(prod => [prod, 1])
                .catch(console.log)
        })
        .then(([product, quantity]) => {
            return fetchedCart.addProduct(product, { through: { quantity: quantity } })
        })
        .then(() => {
            res.redirect('/cart')
        })
        .catch(console.log)
}
exports.postCartDeleteProduct = (req, res, next) => {
    const { productId } = req.body
    req.user.getCart()
        .then(cart => cart.getProducts({ where: { id: productId } }))
        .then(([product]) => product.cartItem.destroy())
        .then(() => {
            res.redirect('/cart')
        })
        .catch(console.log)
}
exports.getOrder = (req, res, next) => {
    req.user.getOrders({ include: ['products'] })
        .then(orders => {
            console.log(orders);
            res.render('shop/orders', {
                pageTitle: "Your Orders",
                path: '/orders',
                orders
            })
        })
        .catch(console.log)

}

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        pageTitle: "Checkout",
        path: '/checkout',
    })
}

exports.postOrder = (req, res, next) => {
    let fetchedCart
    req.user.getCart()
        .then(cart => {
            fetchedCart = cart
            return cart.getProducts()
        })
        .then(products => {
            return req.user.createOrder()
                .then(order => {
                    order.addProducts(products.map(product => {
                        product.orderItem = { quantity: product.cartItem.quantity }
                        return product
                    }))
                })
        })
        .then(() => {
            return fetchedCart.setProducts(null)
        })
        .then(() => {
            res.redirect('/orders')
        })
        .catch(console.log)
}