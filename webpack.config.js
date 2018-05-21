const fs = require('fs').promises
const path = require('path');
const webpack = require('webpack');
const utils = require('corifeus-utils')

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const WebpackOnBuildPlugin = require('on-build-webpack');

const fileAsset = `[name].[hash].[ext]`;
const minimize = process.argv.includes('--production');
const mode = minimize ? 'development' : 'production';

let minimizer = undefined;

const buildDir = __dirname + '/public/webpack';

let devtool;

const plugins = [

    new ExtractTextPlugin({
        filename: '[name].[hash].css',
        disable: false,
        allChunks: true
    }),

    new HtmlWebpackPlugin({
        template: `${__dirname}/twig/layout.tpl.twig`,
        inject: 'head',
        chunksSortMode: 'dependency',
        chunks: ['bundle'],
        filename: `${__dirname}/twig/layout.twig`,
    }),
];

plugins.push(
    new WebpackOnBuildPlugin(async (stats) => {
        try {
            const newFileNames = Object.keys(stats.compilation.assets).map(file => path.resolve(`${buildDir}/${file}`));
            const baseDir = path.resolve(buildDir);
            const baseDirList = await utils.fs.readdirRecursive(baseDir)
            const promises = [];
            for(let baseDirFile of baseDirList) {
                if (!newFileNames.includes(baseDirFile)) {
                    promises.push(
                        fs.unlink(baseDirFile)
                    )
                }
            }
            await Promise.all(promises);
        } catch(e) {
            console.error(e)
            process.exit(-1)
        }
    }),
)

if (minimize) {

    devtool = false;
    const bannerText = require('corifeus-builder').utils.license();

    minimizer = [
        new UglifyJsPlugin({
            sourceMap: true,
            parallel: true,
            cache: true,
            extractComments: {
                condition: /^\**!|@preserve|@license|@cc_on/,

                file: function (fileName) {
                    return `${fileName}.LICENSE.txt`;
                },
                banner: function (webpackBanner) {
                    return `
${bannerText}
For more information about all licenses, please see ${webpackBanner}
`;
                }
            },
            uglifyOptions: {
                compress: {
                    warnings: false
                },
                ecma: 8,
                // todo found out if mangle use or not
                // mangle: false === keep function names
                // mangle: true === drop function names
                mangle: false,
                sourceMap: true,
                comments: false,
                beautify: false
            },
        }),
    ]


    plugins.push(
        new webpack.BannerPlugin({
            banner: bannerText,
            include: /\.css$/,
            exclude: /\.ts$|\.js$/,

// hash:[hash], chunkhash:[chunkhash], name:[name], filebase:[filebase], query:[query], file:[file]
        })
    )

    plugins.push(
        new webpack.SourceMapDevToolPlugin({
            filename: 'sourcemaps/[file].map',
            append: '\n//# sourceMappingURL=./[url]'
        })
    )



}

const fileLoader = [
    {
        loader: 'file-loader',
        options: {
            name: fileAsset,
            outputPath: 'assets',
            context: 'assets',
//            publicPath: 'webpack/assets',
//            useRelativePath: true,
        }
    }
]
module.exports = {
//    watch: true,
    devtool: devtool,

    entry: {
        bundle: "./public/js/bundle.js",
    },
    output: {
        path: buildDir,
        filename: '[name].[hash].js',
        chunkFilename: '[id].[hash].chunk.js',
//        publicPath: '{{ app.url_subdir }}/webpack/',
        publicPath: './webpack/',
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [{
                    loader: 'style-loader' // creates style nodes from JS strings
                }, {
                    loader: 'css-loader' // translates CSS into CommonJS
                }, {
                    loader: 'less-loader' // compiles Less to CSS
                }],
            },
            {
                test: /\.html$/,
                use: [{
                    loader: 'html-loader',
                    options: {
                        minimize: mode,
                        caseSensitive: true
                    }
                }]
            },
            {
                test: /\.(png|jpe?g|gif|ico)$/,
                use: fileLoader
            },
            {
                test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
                use: fileLoader
            }, {
                test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
                use: fileLoader
            }, {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                use: fileLoader
            }, {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                use: fileLoader
            }, {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                use: fileLoader
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                minimize: minimize,
                                sourceMap: true
                            },
                        }]
                })
            }
        ]
    },
    optimization: {
        minimize: minimize,
        minimizer: minimizer
    },
    plugins: plugins,
    mode: mode,
}