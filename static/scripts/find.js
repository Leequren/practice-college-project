// const axios = require("axios");
const inputUrl = document.querySelector('input[name="key-word"]')
const findButton = document.querySelector('button.find-urls')
const savedDiv = document.querySelector('.saved-data')
let links
console.log(inputUrl, findButton)

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
    // console.log(rawMatches)
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
        let dataLinkStyle = (await axios.get(`/buffer?link=${i}`)).data
        console.log(dataLinkStyle)
        cssData += `<style>${dataLinkStyle}</style>`
    }
    // console.log(cssData)
    return cssData
}

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
        let data = (await axios.get(`/buffer?link=${cleanUrl}`)).data
        console.log(data)
        htmlContent = htmlContent.replaceAll(cleanUrl, `data:image/png;base64,${data}`)
        // usefulData.push({curImg: raw[0]})
        // tempData.push(i)
    }
    return htmlContent
}

async function openWindow(htmlContent) {
    htmlContent = await modifyHtmlByPng(htmlContent)
    console.log(htmlContent)
    console.log(cssParser(htmlContent))
    let cssLinks = cssParser(htmlContent)
    console.log(cssLinks)
    // let windowObjectReference = window.open('about:blank', 'hello', 'popup')
    // console.log(htmlContent)
    let styles = await linksToTags(cssParser(htmlContent))
    console.log(styles)
    let scripts = await scriptToTags(scriptParser(htmlContent))
    console.log(scripts)
    //
    const newWindow = window.open("", "new window", "popup");
    // newWindow.document.write('2344')
    // newWindow.document.write(
    //     "<script>window.document.body.innerHTML = '123'</script>"
    // );
    //
    newWindow.document.head.innerHTML += styles
    newWindow.document.body.innerHTML = htmlContent;
    newWindow.document.body.innerHTML += scripts
    //
    // // windowObjectReference.document.write(scripts)
    // // windowObjectReference.document.write(scripts)
    // windowObjectReference.onload = function () {
    //     windowObjectReference.document.write('<h1>dsfsfd</h1>')
    // }
    //     windowObjectReference.document.head.innerHTML += styles
    //     windowObjectReference.document.body.innerHTML = htmlContent;
    //     windowObjectReference.document.body.innerHTML += scripts
    // }
    // console.log(windowObjectReference)
}

updateInfoAboutStorage()

function updateInfoAboutStorage() {
    let localData = Object.entries(localStorage)
    // console.log(localData)
    console.log(savedDiv)
    savedDiv.innerHTML = ''
    for (let i of localData) {
        // console.log(i)
        savedDiv.innerHTML += `
        <a href="#" class="open-window">${i[0]}</a>
        `
    }
    const anchorsToOpenWindow = document.querySelectorAll('.open-window')
    for (let i of anchorsToOpenWindow) {
        i.addEventListener('click', (eventOpenWindow) => {
            eventOpenWindow.preventDefault()
            // console.log(757557)
            const data = localData.filter((element) => element[0] === i.textContent)
            let htmlPopup = data[0][1].slice(1, data[0][1].length - 1)
            htmlPopup.replaceAll(/(\r\n|\n|\r)/gm, '')
            htmlPopup.replaceAll('\r', '')
            console.log(typeof (htmlPopup))
            openWindow(data[0][1].slice(0, data[0][1].length))
        })
    }
}

function saveToLocalStorage(node) {
    node.addEventListener('click', async (event2) => {
        event2.preventDefault()
        // console.log(123)
        // console.log(i.href)
        let data = (await axios.get(`${node.href}`)).data
        console.log(data)
        localStorage.setItem(node.textContent, data)
        console.log(data)
        updateInfoAboutStorage()
    })
}


findButton.addEventListener('click', async (event) => {
    event.preventDefault()
    const res = await fetch(`/docs/${inputUrl.value}`)
    const data = await (res.json())
    console.log(data)
    if (data) {
        let urlContainer = document.querySelector('.urls')
        urlContainer.innerHTML = ''

        for (let i of data) {
            urlContainer.innerHTML += `
        <a class="link-buffer" href="/buffer?link=${i}">${i}</a>
        `
        }

        links = urlContainer.querySelectorAll('a')
        // console.log(links)
        for (let i of links) {
            saveToLocalStorage(i)
        }

    }

})