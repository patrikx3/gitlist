const fs = require('fs');
const fsExtra = require('fs-extra');
const glob = require('glob');
const crypto = require('crypto');
const path = require('path');
const cwd = path.resolve(`${process.cwd()}`)

const prodDir = require('../../../package').corifeus["prod-dir"];

let lessLastHash;
let lessFiles;
const filesLessCache = `${cwd}/build/less/file-less.json`;
const lessSettings = (grunt) => {
    return {
        options: {
            sourceMap: true,
            compress: true,
        },
        get files() {
            const files = glob.sync(`${cwd}/src/browser/less/**/*.*`)
            let string = ''
            for (let filename of files) {
                string += fs.readFileSync(filename, 'utf8')
            }
            const lessHash = crypto.createHash('sha256').update(string).digest("hex");

            if (lessLastHash === lessHash) {
                grunt.log.writeln(`less hash is the same - ${lessHash}`)
                return lessFiles
            }/* else if (fs.existsSync(filesLessCacheBuild) && fs.existsSync(filesLessCache) && fs.readFileSync(cssPostfixFilename, 'utf8').toString() === lessHash) {
                grunt.log.writeln(`less hash is the same in different process, using file less cache - ${lessHash}`)
                return fs.readFileSync(filesLessCache, 'utf8').toString();
            }*/
            grunt.log.writeln(`less hash generating new build - ${lessHash}`)
            lessLastHash = lessHash;
            const pkgFilename = './package.json';
            const pkg = fsExtra.readJsonSync(pkgFilename);
            pkg.corifeus.postfix = lessHash
            //fsExtra.writeJsonSync(pkgFilename, pkg)
            fs.writeFileSync(pkgFilename, JSON.stringify(pkg, null, 4), 'utf8')
            grunt.log.writeln('The css postfix file has been saved!');

            const generateLessFiles = () => {
                const themeDir = './src/browser/less/theme';

                const filesLess = {}

                const root = './node_modules/bootswatch';
                const watches = fs.readdirSync(root);
                const themes = [
                    'default',
                    'solar',
                ];
                const excluded = ['fonts'];

                // css with random
                const themeCss = {
                    'bootstrap-default': `${prodDir}/css/bootstrap-default.${lessHash}.css`,
                    'bootstrap-solar': `${prodDir}/css/bootstrap-solar.${lessHash}.css`,
                }

                for (let path of watches) {
                    const stat = fs.statSync(`${root}/${path}`);
                    if (stat.isDirectory() && !excluded.includes(path)) {
                        themes.push(path);
                        themeCss[`bootstrap-${path}`] = `${prodDir}/css/bootstrap-${path}.${lessHash}.css`;
                    }
                }
                // -- css with random


                // less with random
                fsExtra.ensureDirSync(themeDir);

                const pathFont = 'https://fonts.googleapis.com/css?family=Roboto:300,400,700'

                for (let theme of themes) {
                    const less = `${themeDir}/${theme}.less`;

                    if (theme === 'default') {
                        fs.writeFileSync(less, `
@import "../../../../node_modules/bootstrap/less/bootstrap";
@import "../default";
`)
                    } else if (theme === 'solar') {
                        fs.writeFileSync(less, `
@path: '${pathFont}';
@import "../../../../node_modules/bootstrap/less/bootstrap";
@import "solar/variables";
@import "solar/bootswatch";
@import "../default";
`)
                    } else {
                        fs.writeFileSync(less, `
@path: '${pathFont}';
@import "../../../../node_modules/bootstrap/less/bootstrap";
@import "../../../../node_modules/bootswatch/${theme}/variables";
@import "../../../../node_modules/bootswatch/${theme}/bootswatch";
@import "../default";
`)

                    }
//        console.log(less)
                    filesLess[`public/${prodDir}/css/bootstrap-${theme}.${lessHash}.css`] = less;

                }
                // -- less with random


                fs.writeFileSync(`./src/browser/js/themes.js`, `
const themes = ${JSON.stringify(themeCss, null, 4)};
module.exports = themes;
`);
                fsExtra.outputJsonSync(filesLessCache, filesLess)
                return filesLess
//    grunt.log.writeln(JSON.stringify(filesLess, null, 4))
            }


            lessFiles = generateLessFiles();
            return lessFiles;
        }
    };
}

module.exports.lessSettings = lessSettings;