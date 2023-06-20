const path = require('node:path')
const qs = require('node:querystring')
const querystring = require("querystring");
const fastify = require('fastify')({
    logger: true,
    querystringParser: str => querystring.parse(str.toLowerCase())
})

fastify.register(require('@fastify/autoload'), {
    dir: path.join(__dirname + '/routes'),
    maxDepth: 2
})


fastify.register(require('@fastify/static'), {
    root: path.join(__dirname, '/static'),
    prefix: '/static'
})
fastify.register(require('@fastify/cors'))

fastify.register(require('@fastify/view'), {
    engine: {
        ejs: require('ejs')
    }
})

const start = async () => {
    await fastify.listen({port: 1070})
    // console.log()
}

start()
    .then((err) => {
        console.log(err)
    })

