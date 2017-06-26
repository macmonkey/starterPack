/**
 * Created by Jenson on 02.02.17.
 */
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PurifyCSSPlugn = require('purifycss-webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin')

exports.clean = function (path)
{
    return {
        plugins: [
            new CleanWebpackPlugin([path], {
                path: path,
                exclude: ['images', 'assets', 'fonts']
            }),
        ],
    };
};

exports.devServer = function (paths)
{
    return {
        devServer: {
            historyApiFallback: true,
            contentBase: paths.build,
            hot: true,
            host: process.env.HOST, // Defaults to `localhost`
            // host: '192.168.0.30', // Defaults to `localhost`
            port: process.env.PORT // Defaults to 8080
        },
        plugins: [
            new webpack.NamedModulesPlugin()

            // ???? Error in merge?!?! :(
            // new webpack.HotModuleReplacementPlugin({})
        ],
        devtool: 'source-map'
    }

};

exports.define = function ({env})
{
    return {
        plugins: [
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify('production')
                }
            })
        ]
    }
};

exports.sourceMap = function (sourceMapType = 'eval-source-map')
{
    return {
        devtool: sourceMapType
    }
};


exports.bundleJS = function ()
{
    return {
        plugins: [
            new webpack.optimize.CommonsChunkPlugin({
                name: 'vendor',
                minChunks: function (module)
                {
                    // this assumes your vendor imports exist in the node_modules directory
                    return module.context && module.context.indexOf('node_modules') !== -1;
                }
            })
        ]
    }
};


exports.loadHTML = function (paths)
{
    return {
        module: {
            rules: [
                {
                    test: /\.html/,
                    exclude: /node_modules/,
                    use: [
                        'html-loader'
                    ]
                }
            ]
        }
    }
};


exports.loadIcons = function ()
{
    return {
        module: {
            rules: [{
                test: /(\.js|\.jsx)$/,
                include: [
                    path.resolve(__dirname, './node_modules/react-icons'),
                ],
                use: [{
                    loader: 'babel-loader', options: {
                        presets: ["es2017",
                            "es2015",
                            "stage-2",
                            "react"],
                        plugins: ["transform-object-rest-spread", "transform-export-extensions"]
                    }
                }]
            }]
        }
    }
}
// exports.loadIcons = function ()
// {
//     return {
//         module: {
//             rules: [{
//                 test: /(\.js|\.jsx)$/,
//                 include: [
//                     path.resolve(__dirname, './node_modules/react-icons/node_modules'),
//                     path.resolve(__dirname, './node_modules/react-icons/fa'),
//                     path.resolve(__dirname, './node_modules/react-icons/go')
//                 ],
//                 use: [{loader: 'babel-loader',options:{}}]
//             }]
//         }
//     }
// }

exports.loadJS = function (paths)
{
    return {
        module: {
            rules: [
                {
                    test: /\.js$/,
                    include: [path.resolve(__dirname, 'app')],
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'react-hot-loader'
                        },
                        {

                            loader: 'babel-loader',
                            options: {
                                cacheDirectory: true
                            }
                        }
                    ]
                }
            ]
        }
    }
};

exports.loadFonts = function ()
{
    return {
        module: {
            rules: [{
                test: /\.woff$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        path: '/fonts/'
                    }
                }
            }]
        }

    }
};


exports.loadCSS = function (paths)
{
    return {
        module: {
            rules: [
                {
                    test: /\.scss$/,
                    include: paths,
                    use: [
                        {
                            loader: 'style-loader'
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true
                            }
                        }
                    ]
                },
                {
                    test: /\.css/,
                    include: paths,
                    use: ['style-loader', 'css-loader']
                }
            ]
        }
    }
};

exports.extractCSS = function (paths)
{
    return {
        module: {
            rules: [
                {
                    test: /\.scss$/,
                    // include: paths,
                    loader: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        loader: 'css-loader!sass-loader'
                    })
                },
                {
                    test: /\.css/,
                    // include: paths,
                    loader: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        loader: 'css-loader'
                    })
                }
            ]
        },
        plugins: [
            //Output CSS
            new ExtractTextPlugin('[name].css')
        ]
    }
};


// Create multiple instances
exports.extractCSS2 = function ()
{
    return {
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: ExtractTextPlugin.extract({
                        fallback: "style-loader",
                        use: [
                            {loader: 'style-loader'},
                            {loader: 'css-loader'}
                        ]
                    })
                },
                {
                    test: /\.scss/,
                    use: ExtractTextPlugin.extract({
                        fallback: "style-loader",
                        use: [
                            {loader: 'css-loader'},
                            {loader: 'sass-loader'}
                        ]
                    })
                }
            ]
        },
        plugins: [
            new ExtractTextPlugin('[name].css')
        ]
    }
};

exports.loadImages = function ()
{
    return {
        module: {
            rules: [
                {
                    test: /\.(jpg|png)$/,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                name: '/img-[name].[ext]',
                                path: '/assets/'
                            }
                        }
                    ]
                },
                {
                    test: /\.svg$/,
                    use: [
                        {
                            loader: 'babel-loader'
                        }
                        // ,
                        // {
                        //     loader: 'url-loader',
                        //     options: {
                        //
                        //         svgo: {
                        //
                        //             pretty: true,
                        //             plugins: [
                        //                 {
                        //                     removeTitle: true,
                        //                     cleanupIDs: false,
                        //                 }
                        //             ]
                        //         }
                        //     }
                        // }
                    ]
                }
                // {
                //     test: /\.svg$/,
                //     use: [
                //         {
                //             loader: 'babel-loader'
                //         },
                //         {
                //             loader: 'react-svg-loader',
                //             options: {
                //
                //                 svgo: {
                //
                //                     pretty: true,
                //                     plugins: [
                //                         {
                //                             removeTitle: true,
                //                             cleanupIDs: false,
                //                         }
                //                     ]
                //                 }
                //             }
                //         }
                //     ]
                // }
                // {
                //     test: /\.svg$/,
                //     use: [
                //         {
                //             loader: 'babel-loader'
                //         },
                //         {
                //             loader: 'svgo-loader',
                //             options: {
                //                 plugins: [
                //                     {removeTitle: true},
                //                     {cleanupIDs: false},
                //                     {convertPathData: false}
                //                 ]
                //             }
                //         }
                //     ]
                // }
            ]
        }
    }
};


exports.purifyCSS = function (paths)
{


    console.log('paaath');
    console.log(paths);

    return {
        plugins: [
            new PurifyCSSPlugn({
                paths: paths,
                minimize: true,
                verbose: true,
                purifyOptions: {
                    minify: false,
                    info: false,
                    //LOG rejected selectors
                    rejected: false
                }
            })
        ]
    }
};

exports.uglifyJS = function (paths)
{
    return {
        plugins: [
            new webpack.optimize.UglifyJsPlugin({
                comments:false,
                compress: {
                    // remove warnings
                    warnings: false,

                    // Drop console statements
                    drop_console: true
                }
            })
        ]
    }
};

