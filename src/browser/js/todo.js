let $todoModal
let todoHtml;
window.gitlist.todo = async () => {
    if (todoHtml === undefined) {
        try {
            const response = await $.ajax('https://raw.githubusercontent.com/patrikx3/gitlist/master/todo.md')
            const $todoModalBody = $('#p3x-gitlist-modal-todo-body')
            todoHtml = await window.gitlist.renderMarkdown({
                markdown: response
            })
            $todoModalBody.html(todoHtml);
        } catch (e) {
            window.gitlist.ajaxErrorHandler(e)
        }
    }
    $todoModal.modal('show')
}
$(async () => {
    $todoModal = $('#p3x-gitlist-modal-todo')
})
