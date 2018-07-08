const showNumber = (lineInfo) => {
    const first = lineInfo.line[0];
    return first === ' ' || first === '@' || first === '-' || first === '+';
}

const construct = (data) => {
    const diffs = data.diffs

    let result = `
     <table id="p3x-gitlist-commit-diff-ng-table" style="min-width: 100%; max-width: 100%">
        <tr>
            <td class="lineNo">Old</td>
            <td class="lineNo">&nbsp;&nbsp;</td>
            <td class="old">${diffs.old}}</td>
        </tr>
        <tr>
            <td class="lineNo">&nbsp;&nbsp;</td>
            <td class="lineNo">New</td>
            <td class="new">${diffs.new}</td>
        </tr>
    `

    for(let lineInfo of diffs.lines) {
        result += `
 
        <tr>
          <td class="lineNo">
                ${showNumber(lineInfo) ? lineInfo['num-old'] : '&nbsp;&nbsp;'}
            </td>
            <td class="lineNo">
                ${showNumber(lineInfo) ? lineInfo['num-new'] : '&nbsp;&nbsp;'}
            </td>
            <td style="width: 100%">
                <pre class="${lineInfo.type}">${lineInfo.line}</pre>
            </td>
      </tr>
        `
    }

    result += `
    </table>
    `

    return result;
}

onmessage = function(e) {
    const result = construct(e.data);
    postMessage(result)
}