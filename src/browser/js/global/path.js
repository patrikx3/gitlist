window.gitlist.getPaths = () => {
    const currentUrl = new URL(window.location)
    if (window.gitlist.basepath !== '') {
        currentUrl.pathname = currentUrl.pathname.substring(window.gitlist.basepath.length)
    }
    let paths = currentUrl.pathname.split('/');
    return paths;
}

window.gitlist.getPath = () => {
    let paths = window.gitlist.getPaths();
    paths = paths.slice(4);
    let path = paths.join('/')
    return path
}
