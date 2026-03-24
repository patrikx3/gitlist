let $changelogModal
let changelogHtml;
window.gitlist.changeLog = async () => {
    if (changelogHtml === undefined) {
        try {
            let response = await $.ajax('https://raw.githubusercontent.com/patrikx3/gitlist/master/change-log.md')
            const $changelogModalBody = $('#p3x-gitlist-modal-changelog-body')

            response = $('<textarea />').html(response).text();

            changelogHtml = await window.gitlist.renderMarkdown({
                markdown: response
            })
            $changelogModalBody.html(changelogHtml);
        } catch (e) {
            window.gitlist.ajaxErrorHandler(e)
        }
    }
    bootstrap.Modal.getOrCreateInstance($changelogModal[0]).show()
}
$(async () => {
    $changelogModal = $('#p3x-gitlist-modal-changelog')
})

