window.gitlist.pushHash = (hash) => {
    if (history.pushState) {
        const pushState = location.pathname + hash;
        history.pushState(null, null, pushState);
    } else {
        location.hash = hash;
    }

};


window.gitlist.scrollHash = function (element, event) {
    const url = new URL(element.href)
    const id = url.hash.substring(1)
    const elfind = document.getElementById(id + '-parent')
    const elfind2 = document.getElementById(id)
    if (elfind === null && elfind2 === null) {
        return true;
    }
    window.gitlist.scrollIntoView(elfind || elfind2);

    setTimeout(() => {
        window.scrollBy({
            top: -60,
            behavior: 'smooth'
        });
    }, 300); // Adjust the timeout duration as necessary

    if (event !== undefined) {
        event.preventDefault()
        window.gitlist.pushHash(url.hash)
    }
    return false;
}
