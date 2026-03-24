const fs = require('fs');
const fsExtra = require('fs-extra');
const glob = require('glob');
const crypto = require('crypto');
const path = require('path');
const cwd = path.resolve(`${process.cwd()}`)

const prodDir = require('../../../package').corifeus["prod-dir"];

let sassLastHash;
let sassFiles;
const filesSassCache = `${cwd}/build/sass/file-sass.json`;
const sassSettings = (grunt) => {
    return {
        options: {
            implementation: require('sass'),
            sourceMap: false,
            style: 'compressed',
        },
        get files() {
            let files = glob.sync(`${cwd}/src/browser/scss/**/*.*`)
            let string = ''
            for (let filename of files) {
                string += fs.readFileSync(filename, 'utf8')
            }
            const sassHash = crypto.createHash('sha256').update(string).digest("hex");

            if (sassLastHash === sassHash) {
                grunt.log.writeln(`sass hash is the same - ${sassHash}`)
                return sassFiles
            }
            grunt.log.writeln(`sass hash generating new build - ${sassHash}`)
            sassLastHash = sassHash;
            const pkgFilename = './package.json';
            const pkg = fsExtra.readJsonSync(pkgFilename);
            pkg.corifeus['css-postfix'] = sassHash
            fs.writeFileSync(pkgFilename, JSON.stringify(pkg, null, 4), 'utf8')
            grunt.log.writeln('The css postfix file has been saved!');

            const generateSassFiles = () => {
                const themeDir = './src/browser/scss/theme';

                const filesSass = {}

                const root = './node_modules/bootswatch/dist';
                const watches = fs.readdirSync(root);
                const themes = [
                    'default',
                ];
                const excluded = ['fonts', '.github', 'docs'];

                // css with random
                const themeCss = {
                    'bootstrap-default': `${prodDir}/css/bootstrap-default.${sassHash}.css`,
                }

                for (let watchPath of watches) {
                    const stat = fs.statSync(`${root}/${watchPath}`);
                    if (stat.isDirectory() && !excluded.includes(watchPath)) {
                        // Only include if the theme has a _variables.scss file
                        if (fs.existsSync(`${root}/${watchPath}/_variables.scss`)) {
                            themes.push(watchPath);
                            themeCss[`bootstrap-${watchPath}`] = `${prodDir}/css/bootstrap-${watchPath}.${sassHash}.css`;
                        }
                    }
                }
                // -- css with random


                // sass with random
                fsExtra.ensureDirSync(themeDir);

                const pathFont = 'https://fonts.googleapis.com/css?family=Roboto:300,400,700'

                for (let theme of themes) {
                    const scss = `${themeDir}/${theme}.scss`;

                    if (theme === 'default') {
                        fs.writeFileSync(scss, `@import "../../../../node_modules/bootstrap/scss/bootstrap";
@import "../bs3-compat";
@import "../default";
`)
                    } else {
                        fs.writeFileSync(scss, `$web-font-path: '${pathFont}';
@import "../../../../node_modules/bootswatch/dist/${theme}/variables";
@import "../../../../node_modules/bootstrap/scss/bootstrap";
@import "../../../../node_modules/bootswatch/dist/${theme}/bootswatch";
@import "../bs3-compat";
@import "../default";
`)

                    }
                    filesSass[`public/${prodDir}/css/bootstrap-${theme}.${sassHash}.css`] = scss;

                }
                // -- sass with random


                fs.writeFileSync(`./src/browser/js/themes.js`, `
const themes = ${JSON.stringify(themeCss, null, 4)};
module.exports = themes;
`);
                fsExtra.outputJsonSync(filesSassCache, filesSass)
                return filesSass
            }

            sassFiles = generateSassFiles();



            return sassFiles;
        }
    };
}

module.exports.sassSettings = sassSettings;
