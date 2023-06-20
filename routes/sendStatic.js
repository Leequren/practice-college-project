const path = require('node:path')
const fs = require('node:fs')
const sendData = {
    handler: (req, reply) => {
        const {nameComponent} = req.params
        const stream = fs.createReadStream(path.join(__dirname + '/../docs' + `/${nameComponent}`))
        reply.type('text/html').send(stream)
    }
}

module.exports = function (fastify, opts, next) {
    fastify.get('/api/docs/:nameComponent', sendData)
    next()
}