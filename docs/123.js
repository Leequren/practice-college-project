const fs = require('node:fs')
const axios = require('axios')
const data = fs.readFileSync('./subaru.html', {encoding: "utf-8"})
// console.log(data)

axios.get('https://ru.wikipedia.org/w/load.php?lang=ru&amp;modules=noscript&amp;only=styles&amp;skin=vector')
    .then(res => {
        console.log(res.data)
    })


function parseLink(scriptContent) {
    let rawMatch = scriptContent.match(/src="[\u{30}-\u{39}|\u{2e}|\u{61}-\u{7a}|\u{41}-\u{5a}|\u{2f}]+"/gu)
    console.log(rawMatch[0])
    return rawMatch[0].slice(5, rawMatch[0].length - 1)
}

function scriptParser(htmlContent) {
    let rawMatches = htmlContent.matchAll(/<script\u{20}+src="[\u{30}-\u{39}|\u{2e}|\u{61}-\u{7a}|\u{41}-\u{5a}|\u{2f}]+"/gu)
    // console.log(...rawMatches)
    let srcScripts = []
    for (let i of rawMatches) {
        srcScripts.push(parseLink(i[0]))
    }
    return srcScripts
}

async function scriptToTags(src) {
    let scriptTag = ``
    for (let i of src) {
        let scriptData = (await axios.get(`http://127.0.0.1:1070/buffer?link=${i}`)).data
        console.log(scriptData)
        scriptTag += `<script>\n${scriptData}\n</script>`
    }
    return scriptTag
}
