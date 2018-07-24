window.gitlist.scrollIntoViewOptions = {
    behavior: "instant",
//    block: "start",
//    inline: "start"
};
window.gitlist.scrollIntoView = (el) => {
    el.scrollIntoView(window.gitlist.scrollIntoViewOptions)
    /*
    if ((window.innerHeight + window.scrollY) <= document.body.offsetHeight - navbarHeight ) {
        window.scrollBy(0, -navbarHeight )
    }
    */
};