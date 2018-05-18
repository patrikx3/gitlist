const fs = require('fs');
const fsExtra = require('fs-extra');
const glob = require('glob');
const crypto = require('crypto');
const path = require('path');

const gruntUtils = require('corifeus-builder').utils

const bannerText = `
/*! 
${gruntUtils.license()}
*/
`

const cwd = path.resolve(`${process.cwd()}`)
const cssPostfixFilename = `${cwd}/src/css-postfix`;
const filesscssCache = `${cwd}/build/scss/file-scss.json`;


//let scssLastHash = fs.readFileSync(cssPostfixFilename, 'utf8').toString();
let scssLastHash;
let scssFiles;
//const filesscssCacheBuild = `${cwd}/public/generated/css`;
const scssSettings = (grunt) => {
    return {
        get files() {
            grunt.log.writeln(`scsssettings ${process.pid}`)
            const files = glob.sync(`${cwd}/public/scss/**/*.*`)
            let string = ''
            for (let filename of files) {
                string += fs.readFileSync(filename, 'utf8')
            }
            const scssHash = crypto.createHash('sha256').update(string).digest("hex");

            if (scssLastHash === scssHash) {
                grunt.log.writeln(`scss hash is the same - ${scssHash}`)
                return scssFiles
            }
            /* else if (fs.existsSync(filesscssCacheBuild) && fs.existsSync(filesscssCache) && fs.readFileSync(cssPostfixFilename, 'utf8').toString() === scssHash) {
                            grunt.log.writeln(`scss hash is the same in different process, using file scss cache - ${scssHash}`)
                            return fs.readFileSync(filesscssCache, 'utf8').toString();
                        }*/
            grunt.log.writeln(`scss hash generating new build - ${scssHash}`)
            scssLastHash = scssHash;
            fs.writeFileSync(cssPostfixFilename, scssHash)
            grunt.log.writeln('The css postfix file has been saved!');

            const generatescssFiles = () => {
                const themeDir = './public/scss/theme';

                const filesscss = {}

                const root = './node_modules/bootswatch/dist';
                const watches = fs.readdirSync(root);
                const themes = [
                    'default',
                ];
                const excluded = ['fonts'];

                // css with random
                const themeCss = {
                    'bootstrap-default': `/generated/css/bootstrap-default.${scssHash}.css`,
                }

                for (let path of watches) {
                    const stat = fs.statSync(`${root}/${path}`);
                    if (stat.isDirectory() && !excluded.includes(path)) {
                        themes.push(path);
                        themeCss[`bootstrap-${path}`] = `/generated/css/bootstrap-${path}.${scssHash}.css`;
                    }
                }
                // -- css with random


                // scss with random
                fsExtra.ensureDirSync(themeDir);

                for (let theme of themes) {
                    const scss = `${themeDir}/${theme}.scss`;

                    if (theme === 'default') {
                        fs.writeFileSync(scss, `
${bannerText}                        
@import "../../../node_modules/bootstrap/scss/bootstrap";
@import "../default";
`)
                    } else {
                        fs.writeFileSync(scss, `
${bannerText}                        
@import "../../../node_modules/bootstrap/scss/bootstrap";
@import "../../../node_modules/bootswatch/dist/${theme}/variables";
@import "../../../node_modules/bootswatch/dist/${theme}/bootswatch";
@import "../default";
`)

                    }
//        console.log(scss)
                    filesscss[`public/generated/css/bootstrap-${theme}.${scssHash}.css`] = scss;

                }
                // -- scss with random


                fs.writeFileSync(`./public/js/themes.js`, `
const themes = ${JSON.stringify(themeCss, null, 4)};
module.exports = themes;
`);
                fsExtra.outputJsonSync(filesscssCache, filesscss)
                return filesscss
//    grunt.log.writeln(JSON.stringify(filesscss, null, 2))
            }


            scssFiles = generatescssFiles();
            return scssFiles;
        }
    };
}

const nodeSassCssImporterInstance = (options) => {
    options = options || {import_paths: []};

    var import_paths
        , import_paths_len;

    return function (url, prev, done) {
        if (url.slice(0, 4) !== 'CSS:') {
            return done();
        }

        import_paths = options.import_paths.slice();
        if (fs.existsSync(prev)) {
            import_paths.unshift(path.dirname(prev));
        }
        import_paths_len = import_paths.length;

        if (import_paths_len === 0) {
            return done();
        }

        var css_path = url.slice(4) + '.css'
            , css_filepath, i = 0, import_path;

        for (; i < import_paths_len; ++i) {
            import_path = import_paths[i];
            css_filepath = path.join(import_path, css_path);


            if (fs.existsSync(css_filepath)) {
                try {
                    const data = fs.readFileSync(css_filepath, 'utf8').toString();
                    return done({contents: data});
                } catch(e) {
                    return done(e)
                }
            }
        }
        return done(new Error('Specified CSS file not found! ("' + css_path + '" referenced from "' + prev + '")'));
    };
}

module.exports.nodeSassCssImporter = nodeSassCssImporterInstance;
module.exports.scssSettings = scssSettings;