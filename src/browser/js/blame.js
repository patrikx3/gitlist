$(function () {
    // Initialize BS5 tooltips on blame commit headers
    document.querySelectorAll('.p3x-gitlist-file-fragment-blame-line-header[data-bs-toggle="tooltip"]').forEach(function (el) {
        new bootstrap.Tooltip(el);
    });

    const blameBlocks = document.querySelectorAll('.p3x-gitlist-file-fragment-text');
    if (blameBlocks.length === 0) return;

    // Get file extension or detect language from filename
    const pathParts = window.location.pathname.split('/');
    const fileName = pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2];
    const dotIndex = fileName.lastIndexOf('.');
    let ext = dotIndex > 0 ? fileName.substring(dotIndex + 1).toLowerCase() : '';

    // Map extensionless filenames to languages
    if (!ext) {
        const filenameMap = {
            'dockerfile': 'dockerfile',
            'makefile': 'makefile',
            'cmakelists.txt': 'cmake',
            'gemfile': 'ruby',
            'rakefile': 'ruby',
            'vagrantfile': 'ruby',
        };
        ext = filenameMap[fileName.toLowerCase()] || '';
    }

    // Map non-standard extensions to hljs language names
    const extMap = {
        'mjs': 'javascript',
        'cjs': 'javascript',
        'jsx': 'javascript',
        'tsx': 'typescript',
        'htm': 'xml',
        'html': 'xml',
        'svg': 'xml',
        'twig': 'xml',
        'vue': 'xml',
        'conf': 'nginx',
        'cfg': 'ini',
        'toml': 'ini',
    };
    if (ext && !hljs.getLanguage(ext) && extMap[ext]) {
        ext = extMap[ext];
    }

    blameBlocks.forEach(function (block) {
        const text = block.textContent;
        if (!text.trim()) return;

        try {
            let result;
            if (ext && hljs.getLanguage(ext)) {
                result = hljs.highlight(text, { language: ext });
            } else {
                result = hljs.highlightAuto(text);
            }
            block.classList.add('hljs');
            block.innerHTML = result.value;
        } catch (e) {
            // fallback: leave as plain text
        }
    });
});
