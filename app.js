const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()
const sequelize = require('./utils/database')

const Product = require('./models/product')
const User = require('./models/user')
const Cart = require('./models/cart')
const CartItem = require('./models/cart-item')
const OrderItem = require('./models/order-item')
const Order = require('./models/order')

app.set('view engine', 'ejs')
app.set('views', 'views')

const adminRoute = require('./routes/admin')
const rootDir = require('./utils/path')
const shopRoute = require('./routes/shop')

// db.execute('SELECT * FROM Products').then((result) => {
//     console.log(result[0]);
// }).catch(err => {
//     console.log(err);
// })

const notFoundController = require('./controllers/notFound')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(rootDir, 'public')))

app.use((req, res, next) => {
    User.findByPk(1).then(user => {
        req.user = user
        next()
    }).catch(console.log)
})

app.use('/admin', adminRoute)

app.use(shopRoute)

app.use(notFoundController.notFound)

Product.belongsTo(User, {
    constraints: true, onDelete: 'CASCADE'
})
User.hasMany(Product)
User.hasOne(Cart)
Cart.belongsTo(User)
Cart.belongsToMany(Product, { through: CartItem })
Product.belongsToMany(Cart, { through: CartItem })
Order.belongsTo(User)
User.hasMany(Order)
Order.belongsToMany(Product, { through: OrderItem })
Product.belongsToMany(Order, { through: OrderItem })

sequelize
    // .sync({ force: true })
    .sync()
    .then(() => {
        return User.findByPk(1)
    })
    .then(user => {
        if (!user) {
            return User.create({
                name: 'Phong2',
                email: 'phong2@gmail.com'
            })
        }
        return Promise.resolve(user)
    })
    .then(user => {
        return user.createCart()
    })
    .then((user) => {
        console.log(user);
        app.listen(3000)
    })
    .catch(console.log)

