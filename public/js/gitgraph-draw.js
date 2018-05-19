$(function() {
    const graphList = [];

    if (!document.getElementById('graph-canvas')) {
        return;
    }

    $("#graph-raw-list li span.node-relation").each(function () {
        graphList.push($(this).text());
    })

    global.gitGraph(document.getElementById('graph-canvas'), graphList);

    if ($("#rev-container")) {
        $("#rev-container").css("width", $('#git-graph-container').width() - $('#graph-canvas').width());
    }
})
