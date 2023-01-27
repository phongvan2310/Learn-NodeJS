const http = require('http')
const requestHandler = require('./routes')
const server = http.createServer((req, res) => {
    const { url, method, data } = req
    console.log({ url, method });
    if (url === '/') {
        res.setHeader('Content-Type', 'text/html')
        res.write('<html>')
        res.write('<head><title>Test</title></head>')
        res.write(`<body>
        <form method='post' action='/create-user'>
        <input type='text' name='username'/>
        <button>Save</button>
        </form></body>
        `)
        res.write('<html>')
        return res.end()
    }
    if (url === '/create-user') {
        const body = []
        req.on('data', (chunk) => {
            console.log(chunk);
            body.push(chunk)
        })
        req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString()
            console.log(parsedBody);
        })
        res.statusCode = 302
        res.setHeader('Location', '/')
        return res.end()
    }
    if (url === '/user') {
        res.setHeader('Content-Type', 'text/html')
        res.write('<ul><li>User</li></ul>')
        return res.end()
    }
})
server.listen(3000)