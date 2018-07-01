$(() => {

    const commitList = $('#p3x-gitlist-commits-list');

    if (commitList.length > 0) {
        const twemojiSettings = require('./settings').twemoji;
        commitList.html(twemoji.parse(commitList.html(), twemojiSettings));
    }

})