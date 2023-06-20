const downloadContainer = document.querySelector('.downloads')
const data = Object.entries(localStorage)
// console.log(String(JSON.parse(data[0][1]).data).replaceAll(',', ' '))
console.log(JSON.parse(Object.entries(localStorage)[0][1]).toString()[0])