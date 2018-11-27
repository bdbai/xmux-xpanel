const http = require('http')
const https = require('https')
const childProcess = require('child_process')

http.createServer((req, res) => {
    const upReq = https.request({
        host: 'SERVER_URL',
        method: 'POST',
        path: '/v2/admin/login',
        protocol: 'https:'
    }, msg => {
        for (const h in msg.headers) {
            res.setHeader(h, msg.headers[h])
        }
        res.setHeader('Access-Control-Allow-Origin', '*')
        msg.pipe(res)
        msg.once('close', () => res.end())
    })
    for (const h in req.headers) {
        upReq.setHeader(h, req.headers[h])
    }
    upReq.setHeader('host', 'SERVER_URL')
    upReq.setHeader('origin', 'SERVER_URL')
    req.pipe(upReq).once('finish', () => {
        upReq.end()
    })
}).listen(8000)

childProcess.spawn('powershell', ['npx', 'react-scripts-ts', 'start'], {
    env: process.env,
    stdio: 'inherit'
})
