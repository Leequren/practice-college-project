const fs = require('node:fs')
const axios = require('axios')
const data = fs.readFileSync('./subaru.html', {encoding: "utf-8"})
// console.log(data)

axios.get('https://ru.wikipedia.org/w/load.php?lang=ru&amp;modules=noscript&amp;only=styles&amp;skin=vector')
    .then(res => {
        console.log(res.data)
    })


async function modifyHtmlByPng(htmlContent) {
    let rawMatches = [...htmlContent.matchAll(/<img\u{20}+src="[\u{30}-\u{39}|\u{2e}|\u{61}-\u{7a}|\u{41}-\u{5a}|\u{2f}]+">/gu)]
    // console.log(...rawMatches)
    let usefulData = []
    for (let raw of rawMatches) {
        // console.log(raw[0])
        let srcMatch = [...raw[0].match(/src="[\u{30}-\u{39}|\u{2e}|\u{61}-\u{7a}|\u{41}-\u{5a}|\u{2f}]+"/gu)]
        // console.log(srcMatch)
        let cleanUrl = srcMatch[0].slice(5, srcMatch[0].length - 1)
        console.log(cleanUrl)
        let data = (await axios.get(`http://localhost:1070/buffer?link=${cleanUrl}`)).data
        console.log(data)
        htmlContent = htmlContent.replaceAll(cleanUrl, `data:image/png;base64,${data}`)
        // usefulData.push({curImg: raw[0]})
        // tempData.push(i)
    }
    console.log(htmlContent)
}

modifyHtmlByPng(data)
    .then()