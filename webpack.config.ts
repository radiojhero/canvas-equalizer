/* tslint:disable:object-literal-sort-keys */

import * as autoprefixer from 'autoprefixer';
import * as ExtractTextPlugin from 'extract-text-webpack-plugin';
import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import * as OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import * as path from 'path';
import * as webpack from 'webpack';

const banner = 'canvas-equalizer ~ License: BSD-2-Clause-FreeBSD ~ https://opensource.kantorad.io/canvas-equalizer/';

// tslint:disable-next-line:no-magic-numbers
export default function ({ prod = false, port = 8080, poll = false } = {}) {
    const devEntries = prod ? [] : [
        `webpack-dev-server/client?http://0.0.0.0:${port}`,
        'webpack/hot/only-dev-server',
    ];
    const devPlugins = prod ? [] : [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new HtmlWebpackPlugin(),
    ];
    const prodPlugins = prod ? [
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.min\.css$/,
            cssProcessorOptions: {
                safe: true,
                discardComments: true,
            },
        }),
        new webpack.optimize.UglifyJsPlugin({
            test: /\.min\.js$/,
            sourceMap: true,
            mangle: {
                /*props: {
                    regex: /^_(?!_esModule)/,
                },*/
            },
            comments: false,
        }),
    ] : [];
    const devServer = prod ? undefined : {
        hot: true,
        contentBase: __dirname,
        compress: true,
        host: '0.0.0.0',
        port,
        publicPath: '/',
        watchOptions: { poll },
    };

    return {
        context: path.resolve(__dirname, 'src'),
        entry: (() => {
            const entries: any /* webpack.Entry */ = {};

            for (const [fromType, toType] of [['ts', 'js'], ['scss', 'css']]) {
                const entryName = `${toType}/CanvasEqualizer.${toType}`;
                const entryPath = `./${fromType}/index.${fromType}`;
                entries[entryName] = [...devEntries, entryPath];

                if (prod) {
                    entries[entryName.replace(/(?=\.[^.]+$)/, '.min')] = entryPath;
                }
            }

            return entries;
        })(),
        output: {
            library: 'CanvasEqualizer',
            libraryTarget: 'umd',
            filename: '[name]',
            path: path.resolve(__dirname, 'dist'),
            publicPath: '/',
        },
        module: {
            rules: [{
                enforce: 'pre',
                test: /\.(?:js|css)$/,
                exclude: /node_modules/,
                loader: 'source-map-loader',
            }, {
                test: /\.ts$/,
                exclude: /node_modules/,
                loaders: ['babel-loader', 'awesome-typescript-loader'],
            }, {
                test: /\.scss$/,
                exclude: /node_modules/,
                loader: ExtractTextPlugin.extract([{
                    loader: 'css-loader',
                    options: {
                        sourceMap: true,
                        importLoaders: 1,
                    },
                }, {
                    loader: 'postcss-loader',
                    options: {
                        plugins: () => [autoprefixer],
                    },
                }, {
                    loader: 'sass-loader',
                    options: {
                        sourceMap: true,
                        outputStyle: 'expanded',
                    },
                }]),
            }],
        },
        resolve: {
            extensions: ['.ts', '.js'],
        },
        plugins: [
            ...devPlugins,
            ...prodPlugins,
            new ExtractTextPlugin('[name]'),
            new webpack.BannerPlugin({ banner, entryOnly: true }),
        ],
        devtool: 'source-map',
        devServer,
    };
}
