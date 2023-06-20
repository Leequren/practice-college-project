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
        if (link.split('.')[1]) {
            const bufferInfo = fs.readFileSync(path.join(__dirname, '../', `docs/`, link), {encoding: "utf-8"})
            console.log(bufferInfo)
            console.log()
            const responseData = JSON.stringify({data: bufferInfo})
            reply.code(200).header('Content-Type', 'text/html; charset=utf-8;').send(bufferInfo.replaceAll(/(\r\n|\n|\r|\t)/gm, ""))
        }
    }
}

module.exports = function (fastify, opts, next) {
    fastify.get('/buffer', bufferOptsGet)
    next()
}