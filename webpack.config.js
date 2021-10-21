const config = require('corifeus-builder/src/utils/config').config
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin')

const minimize = process.argv.includes('--mode=production');
const mode = minimize ? 'production' : 'development';

let minimizer = undefined;

const prodDir = require('./package').corifeus["prod-dir"];

const buildDir = __dirname + `/public/${prodDir}/webpack`;

let devtool;

const publicPath = 'prod/webpack/'


const rules = [
    {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
    },
    {
        test: /\.worker\.js$/,
        use: { loader: 'worker-loader' }
    },
    {
        test: /\.(css|less)$/,
        use: [
            {
                loader: MiniCssExtractPlugin.loader,
                options: {
                },
            },
            'css-loader',
            {
                loader: 'less-loader',
            }],
    },
    {
        test: /\.html$/,
        use: [{
            loader: 'html-loader',
            options: {
                minimize: minimize,
                //caseSensitive: true
            }
        }]
    },
    {
        test: /\.(png|jpe?g|gif|ico)$/,
        type: 'asset/resource',
    },
    {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        type: 'asset/resource',
    }, {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        type: 'asset/resource',
    }, {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        type: 'asset/resource',
    }, {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        type: 'asset/resource',
    }, {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        type: 'asset/resource',
    },
]

const plugins = [

    /*
    not needed, as require or import will import, but it is to stop automatically all, we rather employ the import instead of webpack
    new webpack.ContextReplacementPlugin(
        /moment[/\\]locale$/,
//        /de|fr|hu/
        /hu/
    ),
     */
    new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/
    }),

    new HtmlWebpackPlugin({
        template: `${__dirname}/src/browser/layout.tpl.twig`,
        inject: 'body',
        chunks: ['bundle'],
        publicPath: publicPath,
        filename: `${__dirname}/src/twig/layout.twig`,
    }),
    new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: !minimize ? '[name].css' : '[id].[contenthash].css',
        chunkFilename: !minimize ? '[name].css' : '[id].[contenthash].css',
    }),];

/*
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
 */

if (minimize) {

    const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

    devtool = false;
    const bannerText = require('corifeus-builder').utils.license();

    minimizer = [
        new CssMinimizerPlugin(),
        new TerserPlugin({
            parallel: true,
            extractComments: {
                condition: /^\**!|@preserve|@license|@cc_on/,

                filename: function (fileOptions) {
                    return `${fileOptions.filename}.LICENSE.txt`;
                },
                banner: function (webpackBanner) {
                    return `
${bannerText}
For more information about all licenses, please see ${webpackBanner}
`;
                }
            },
            terserOptions: {
                compress: {
                    warnings: false
                },
                ecma: config.ecma,
                // todo found out if mangle use or not
                // mangle: false === keep function names
                // mangle: true === drop function names
                mangle: true,
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

    /*
    https://webpack.js.org/guides/build-performance/#source-maps
    plugins.push(
        new webpack.SourceMapDevToolPlugin({
            filename: 'sourcemaps/[file].map',
            append: '\n//# sourceMappingURL=./[url]'
        })
    )
     */

    rules.unshift({
        test: /\.js$/,
        loader: 'webpack-remove-debug'
    })
}


const webpackConfig = {
//    watch: true,
    devtool: devtool,

    entry: {
        bundle: "./src/browser/bundle.js",
    },
    output: {
        path: buildDir,
        filename: '[id].[contenthash].js',
       // chunkFilename: '[name].[contenthash].js',
//        publicPath: '{{ app.url_subdir }}/webpack/',
        publicPath: `auto`,
        assetModuleFilename: `assets/[hash][ext]`,
    },
    module: {
        rules: rules
    },
    optimization: {
        minimize: minimize,
        minimizer: minimizer
    },
    plugins: plugins,
    mode: mode,
}

webpackConfig.ignoreWarnings = [/Failed to parse source map/];

module.exports = webpackConfig
