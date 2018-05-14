const ExtractTextPlugin = require('extract-text-webpack-plugin');
//const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const webpack = require('webpack');

const fileAsset = `[name].[ext]`;
const minimize = process.argv.includes('--production');
const mode = minimize ? 'development' : 'production';

let minimizer = undefined;

const pkg = require('./package');

let devtool;

const plugins = [
    new ExtractTextPlugin({
        filename: 'style.css'
    }),

    /*
    new HtmlWebpackPlugin({
        template: `./public/twig/layout.twig`,
        chunks: ['bundle'],
    }),
    */
];

if (minimize) {

    devtool = false;
    const bannerText = `@license ${pkg.name} v${pkg.version}
  
${pkg.description}

License: MIT Copyright (c) ${new Date().getFullYear()} Patrik Laszlo`;

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
                mangle: true,
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
            append: '\n//# sourceMappingURL=/[url]'
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
            publicPath: 'webpack/assets',
//            useRelativePath: true,
        }
    }
]
module.exports = {
    devtool: devtool,

    entry: {
        bundle: "./public/js/bundle.js",
    },
    output: {
        path: __dirname + '/public/webpack',
        filename: "[name].js"
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