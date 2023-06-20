const server = require('../server')
const urls = require('../urls')
const indexOpts = {
    handler: (req, reply) => {
        reply.view('/templates/index.ejs')
    }
}
console.log(123)
const findOptsGet = {
    handler: (req, reply) => {
        let {nameComponent} = req.params
        // console.log(urls)
        reply.send(urls[nameComponent])
    }
}

module.exports = function (fastify, opts, next) {
    fastify.get('/', indexOpts)
    fastify.get('/docs/:nameComponent', findOptsGet)
    next()
}