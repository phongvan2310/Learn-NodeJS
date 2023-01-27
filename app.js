const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()

app.set('view engine', 'ejs')
app.set('views', 'views')

const adminData = require('./routes/admin')
const rootDir = require('./utils/path')
const shopRoute = require('./routes/shop')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(rootDir, 'public')))

app.use('/admin', adminData.routes)

app.use(shopRoute)

app.use((req, res, next) => {
    res.render('404', {
        pageTitle: 'Page not found'
    })
    // res.status(404).sendFile(path.join(__dirname, 'views', '404.html'))
})

app.listen(3000)