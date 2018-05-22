window.gitlist.treegraph = () => {
    if (!document.getElementById('graph-canvas')) {
        return;
    }
    const log = $("#p3x-gitlist-treegraph-log");
    if (log) {
        const graphList = [];
        $("#graph-raw-list li span.node-relation").each(function () {
            graphList.push($(this).text());
        })
        global.gitGraph(document.getElementById('graph-canvas'), graphList);
    }
}
