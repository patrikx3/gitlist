let $changelogModal
let changelogHtml;
window.gitlist.changeLog = async() => {
    if (changelogHtml === undefined) {
        try {
            const response = await $.ajax('https://raw.githubusercontent.com/patrikx3/gitlist/master/changelog.md')
            const $changelogModalBody = $('#p3x-gitlist-modal-changelog-body')
            changelogHtml = window.gitlist.renderMarkdown({
                markdown: response
            })
            $changelogModalBody.html(changelogHtml);
        } catch(e) {
            window.gitlist.ajaxErrorHandler(e)
        }
    }
    $changelogModal.modal('show')
}
$(async () => {
    $changelogModal = $('#p3x-gitlist-modal-changelog')
})
