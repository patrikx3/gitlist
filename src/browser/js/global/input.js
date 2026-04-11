const Cookies = require('js-cookie')

window.gitlist.clearInput = (name) => {
    const input = $(`[name=${name}]`)
    input.val('')
    Cookies.set(`p3x-gitlist-${name}`, '', window.gitlist.cookieSettings)
    input.focus()
}

window.gitlist.setInputQuery = (name) => {
    const input = $(`[name=${name}]`)
    Cookies.set(`p3x-gitlist-${name}`, input.val(), window.gitlist.cookieSettings)
}
