let $changelogModal
window.gitlist.changeLog = () => {
    $changelogModal.modal('show')
}
$(async () => {
    $changelogModal = $('#p3x-gitlist-modal-changelog')
    try {
        const response = await $.ajax('https://raw.githubusercontent.com/patrikx3/gitlist/master/changelog.md')
        const $changelogModalBody = $('#p3x-gitlist-modal-changelog-body')
        const html = window.gitlist.renderMarkdown({
            markdown: response
        })
        $changelogModalBody.html(html);
    } catch(e) {
        window.gitlist.ajaxErrorHandler(e)
    }
})
