const { getDb } = require('../utils/database')
const mongoDb = require('mongodb')
class Product {
    constructor(title, price, description, imageUrl, id, userId) {
        this.title = title
        this.price = price
        this.description = description
        this.imageUrl = imageUrl
        this._id = id ? new mongoDb.ObjectId(id) : null
        this.userId = userId
    }
    save() {
        const db = getDb()

        if (this._id) {
            return db.collection('products')
                .updateOne({ _id: this._id }, { $set: this })
                // .then(result => console.log(result))
                .catch(console.log)
        } else {
            return db.collection('products')
                .insertOne(this)
                // .then(result => console.log(result))
                .catch(console.log)
        }

    }
    static fetchAll() {
        const db = getDb()
        return db.collection('products').find()
            .toArray()
            .then(products => {
                // console.log(products)
                return products
            })
            .catch(console.log);
    }
    static findById(id) {
        const db = getDb()
        return db.collection('products').find({ _id: new mongoDb.ObjectId(id) })
            .next()
            .then(products => {
                // console.log(products)
                return products
            })
            .catch(console.log);
    }
    static deleteById(id) {
        const db = getDb()
        return db.collection('products').deleteOne({ _id: new mongoDb.ObjectId(id) })
    }
}
// const Sequelize = require('sequelize');
// const sequelize = require('../utils/database_sql')
// const Product = sequelize.define('product', {
//     id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//     },
//     title: Sequelize.STRING,
//     price: {
//         type: Sequelize.DOUBLE,
//         allowNull: false,
//     },
//     imageUrl: {
//         type: Sequelize.STRING,
//         allowNull: false,
//     },
//     description: {
//         type: Sequelize.STRING,
//     }
// });
module.exports = Product