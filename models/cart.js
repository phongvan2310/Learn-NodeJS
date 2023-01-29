const fs = require('fs')
const path = require('path')
const rootDir = require('../utils/path')
const Product = require('./product')
const p = path.join(rootDir, 'data', 'cart.json')

module.exports = class Cart {
    static getCart(cb) {
        fs.readFile(p, (err, fileContent) => {
            if (!err) {
                const cart = JSON.parse(fileContent)
                return cb(cart)
            }
            return cb(null)
        })
    }
    static deleteProduct(id, price) {
        fs.readFile(p, (err, fileContent) => {
            if (!err) {
                const cart = JSON.parse(fileContent)
                const updatedCart = { ...cart }
                const product = cart.products.find(item => item.id == id)
                if (product) {
                    updatedCart.products = updatedCart.products.filter(prod => prod.id != id)
                    updatedCart.totalPrice = cart.totalPrice - +price * product.qty
                    fs.writeFile(p, JSON.stringify(updatedCart), err => {
                        console.log(err);
                    })
                }
            }
        })
    }
    static addProduct(id, productPrice) {
        fs.readFile(p, (err, fileContent) => {
            let cart = { products: [], totalPrice: 0 }
            if (!err) {
                cart = JSON.parse(fileContent.length ? fileContent : '{"products":[],"totalPrice":0}')
            }
            const existingProductIndex = cart.products?.findIndex(item => item.id == id)
            const existingProduct = cart.products?.[existingProductIndex]
            let updatedProduct;
            if (existingProduct) {
                updatedProduct = { ...existingProduct, qty: existingProduct.qty + 1 }
                cart.products = [...cart.products]
                cart.products[existingProductIndex] = updatedProduct
            } else {
                updatedProduct = {
                    id, qty: 1
                }
                cart.products = [...cart.products, updatedProduct]
            }
            cart.totalPrice = cart.totalPrice + +productPrice
            fs.writeFile(p, JSON.stringify(cart), err => {
                console.log(err);
            })
        })
    }
}