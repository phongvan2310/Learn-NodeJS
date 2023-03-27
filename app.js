const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()

app.set('view engine', 'ejs')
app.set('views', 'views')

const adminRoute = require('./routes/admin')
const rootDir = require('./utils/path')
const shopRoute = require('./routes/shop')

const { mongoConnect } = require('./utils/database')
const User = require('./models/user')

const notFoundController = require('./controllers/notFound')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(rootDir, 'public')))

app.use((req, res, next) => {
    User.findById('641ecadee80812c2fb4f96d3').then(user => {
        req.user = new User(user.name, user.email, user.cart, user._id)
        next()
    }).catch(console.log)
})

app.use('/admin', adminRoute)

app.use(shopRoute)

app.use(notFoundController.notFound)

mongoConnect(() => {
    app.listen(3001)
})
