const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()

app.set('view engine', 'ejs')
app.set('views', 'views')

const adminRoute = require('./routes/admin')
const rootDir = require('./utils/path')
const shopRoute = require('./routes/shop')
const notFoundController = require('./controllers/notFound')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(rootDir, 'public')))

app.use('/admin', adminRoute)

app.use(shopRoute)

app.use(notFoundController.notFound)

app.listen(3000)