const server = require('../server')
const fs = require('node:fs')
const path = require('node:path')
const axios = require('axios')

console.log(234)
const bufferOptsGet = {
    handler: async (req, reply) => {
        const {link} = req.query
        // let url = `http://127.0.0.1:1070/api/docs/subaru.html`
        // console.log(url)
        // let data = await axios.get(url)
        // console.log(data)
        let splittedData = link.split('.')
        if (splittedData[1]) {

            if (splittedData[1] === 'html' || splittedData[1] === 'css') {
                const bufferInfo = fs.readFileSync(path.join(__dirname, '../', `docs/`, link), {encoding: "utf-8"})
                console.log(bufferInfo)
                console.log()
                const responseData = JSON.stringify({data: bufferInfo})
                reply.code(200).header('Content-Type', 'text/html; charset=utf-8;').send(bufferInfo.replaceAll(/(\r\n|\n|\r|\t)/gm, ""))
            } else if (splittedData[1] === 'js') {
                const bufferInfo = fs.readFileSync(path.join(__dirname, '../', `docs/`, link), {encoding: "utf-8"})
                // console.log(123)
                console.log(bufferInfo)
                reply.code(200).header('Content-Type', 'text/plain; charset=uft-8;').send(bufferInfo)
            } else if (splittedData[1] === 'png') {
                const bufferInfo = fs.readFileSync(path.join(__dirname, '../', `docs/`, link), {encoding: "base64"})
                // console.log(123)
                console.log(bufferInfo)
                reply.code(200).header('Content-Type', 'text/html; charset=utf-8;').send(bufferInfo)
            }
        }
    }
}

module.exports = function (fastify, opts, next) {
    fastify.get('/buffer', bufferOptsGet)
    next()
}