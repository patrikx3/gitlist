module.exports = {
    twemoji: {
        callback: function(icon, options, variant) {
            if (icon === "") {
                return false;
            }
            return ''.concat(options.base, options.size, '/', icon, options.ext);
        },
        folder: 'svg',
        ext: '.svg',
    }
}