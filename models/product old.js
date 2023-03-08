const fs = require('fs')
const path = require('path')
const rootDir = require('../utils/path')
const p = path.join(rootDir, 'data', 'products.json')
const Cart = require('./cart')
const getProductFromFIle = cb => {
    fs.readFile(p, (err, fileContent) => {
        if (err) {
            cb([])
        } else {
            cb(JSON.parse(fileContent.length ? fileContent : '[]'))
        }
    })
}
module.exports = class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id
        this.title = title
        this.imageUrl = imageUrl
        this.description = description
        this.price = price
    }
    save() {
        getProductFromFIle(products => {
            if (this.id) {
                console.log('here');
                const existingProduct = products.findIndex(prod => prod.id == this.id)
                const updatedProducts = [...products]
                updatedProducts[existingProduct] = this;
                fs.writeFile(p, JSON.stringify(updatedProducts), err => console.log(err))
            } else {
                this.id = Date.now()
                products.push(this);
                fs.writeFile(p, JSON.stringify(products), err => console.log(err))
            }
        })

    }

    static deleteById(id) {
        getProductFromFIle(products => {
            const product = products.find(prod => prod.id == id)
            const updatedProduct = products.filter(item => item.id != id)
            fs.writeFile(p, JSON.stringify(updatedProduct), err => {
                if (!err) {
                    Cart.deleteProduct(id, product.price)
                }
            })
        })
    }
    static fetchAll(cb) {
        getProductFromFIle(cb)
    }
    static findById(id, cb) {
        getProductFromFIle(products => {
            const product = products.find(item => item.id == id)
            cb(product)
        })
    }
}