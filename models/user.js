// const Sequelize = require('sequelize')
// const sequelize = require('../utils/database')
// const User = sequelize.define('User', {
//     id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         primaryKey: true,
//         allowNull: false
//     },
//     name: Sequelize.STRING,
//     email: Sequelize.STRING
// })
const { getDb } = require("../utils/database");
const mongoDb = require("mongodb");

class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }
  addToCart(prod) {
    const cartProductIndex = this.cart?.items?.findIndex((cp) => {
      return cp.productId.toString() === prod._id.toString();
    });
    console.log(cartProductIndex);
    const updatedCartItems = [...(this.cart?.items ?? [])];
    if (cartProductIndex >= 0) {
      updatedCartItems[cartProductIndex].quantity++;
    } else {
      updatedCartItems.push({
        productId: new mongoDb.ObjectId(prod._id),
        quantity: 1,
      });
    }
    const updatedCart = {
      items: updatedCartItems,
    };
    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new mongoDb.ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }
  save() {
    const db = getDb();
    return db
      .collection("users")
      .insertOne(this)
      .then((result) => console.log(result))
      .catch(console.log);
  }
  getCart() {
    const db = getDb();
    const productIds = this.cart.items?.map((item) => item.productId) ?? [];
    return db
      .collection("products")
      .find({ _id: { $in: productIds } })
      .toArray()
      .then((products) => {
        this.cart.items = this.cart.items.filter(
          (prod) =>
            products.findIndex(
              (item) => item._id.toString() === prod.productId.toString()
            ) >= 0
        );
        return db
          .collection("users")
          .updateOne(
            { _id: new mongoDb.ObjectId(this._id) },
            {
              $set: {
                cart: {
                  items: this.cart.items,
                },
              },
            }
          )
          .then(() =>
            products.map((prod) => ({
              ...prod,
              quantity: this.cart.items.find(
                (i) => i.productId.toString() === prod._id.toString()
              )?.quantity,
            }))
          );
      });
  }

  deleteCartItem(productId) {
    const db = getDb();
    const updatedCartItem = this.cart.items.filter(
      (item) => item.productId.toString() !== productId.toString()
    );
    console.log(productId);
    console.log(this.cart.items);
    console.log(updatedCartItem);
    return db
      .collection("users")
      .updateOne(
        { _id: new mongoDb.ObjectId(this._id) },
        { $set: { cart: { items: updatedCartItem } } }
      );
  }

  addOrder() {
    const db = getDb();
    return this.getCart()
      .then((products) => {
        const order = {
          items: products,
          user: {
            _id: new mongoDb.ObjectId(this._id),
            name: this.name,
          },
        };
        return db.collection("orders").insertOne(order);
      })
      .then((result) => {
        this.cart = { items: [] };
        return db
          .collection("users")
          .updateOne(
            { _id: new mongoDb.ObjectId(this._id) },
            { $set: { cart: { items: [] } } }
          );
      });
  }

  getOrders() {
    const db = getDb();
    return db
      .collection("orders")
      .find({ "user._id": new mongoDb.ObjectId(this._id) })
      .toArray();
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection("users")
      .findOne({ _id: new mongoDb.ObjectId(userId) })
      .then((user) => {
        return user;
      })
      .catch(console.log);
  }
}
module.exports = User;
