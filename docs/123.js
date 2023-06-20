const fs = require('node:fs')
const axios = require('axios')
const data = fs.readFileSync('./subaru.html', {encoding: "utf-8"}).replaceAll(/(\r\n|\t|\n)/gm, '')
console.log(data)

axios.get('http://127.0.0.1:1070/buffer?link=subaru.html')
    .then(res=>{
        console.log(res.data)
})
function linkCssParser(htmlLinkContent) {
    let rawMatchesLinks = htmlLinkContent.match(/href="[\u{30}-\u{39}|\u{2e}|\u{61}-\u{7a}|\u{41}-\u{5a}|\u{2f}]+"/gu)
    // console.log(rawMatchesLinks)
    let firstStepCleanMatchesLinks
    firstStepCleanMatchesLinks = rawMatchesLinks[0]
    return firstStepCleanMatchesLinks.slice(6, firstStepCleanMatchesLinks.length - 1)
}

function cssParser(htmlContent) {
    // console.log(htmlContent)
    // console.log(...htmlContent.matchAll(/<(\u{20})*link(\u{20})+rel="stylesheet"(\u{20})+href="[\u{30}-\u{39}|\u{2e}|\u{61}-\u{7a}|\u{41}-\u{5a}|\u{2f}]+"/gu))
    // console.log(htmlContent.slice(80).search(/<(\u{20})*link(\u{20})+rel="stylesheet"(\u{20})+href="[\u{30}-\u{39}|\u{2e}|\u{61}-\u{7a}|\u{41}-\u{5a}|\u{2f}]+"/u))
    let rawMatches = htmlContent.matchAll(/<(\u{20})*link(\u{20})+rel="stylesheet"(\u{20})+href="[\u{30}-\u{39}|\u{2e}|\u{61}-\u{7a}|\u{41}-\u{5a}|\u{2f}]+"/gu)
    let firstStepCleanMatches = []
    // console.log(...rawMatches)
    for (let i of rawMatches) {
        firstStepCleanMatches.push(i[0])
    }
    // console.log(firstStepCleanMatches)
    let links = []
    for (let i of firstStepCleanMatches) {
        links.push(linkCssParser(i))
    }
    return links
}

async function linksToTags(links) {
    let cssData = ``
    for (let i of links) {
        console.log(i)
        let dataLinkStyle = (await axios.get(`http://127.0.0.1:1070/buffer?link=${i}`)).data
        console.log(dataLinkStyle)
        cssData += `<style>${dataLinkStyle.data}</style>`
    }
    console.log(cssData)
}