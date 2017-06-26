/**
 * Created by Jenson on 01.02.17.
 */
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
// const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

const webpack = require('webpack');
const merge = require('webpack-merge');
const glob = require('glob');

const parts = require('./webpack.parts');

const PATHS = {
    app: path.join(__dirname, 'app'),
    build: path.join(__dirname, 'build', '/')
};
const common = {

    entry: PATHS.app + '/index.js',
    output: {
        path: PATHS.build,
        filename: '[name].js'


    },

    plugins: [
        // new FaviconsWebpackPlugin({
        //     logo: './assets/favicon1024.png',
        //     inject: true,
        //     persistentCache: true,
        //     icons: {
        //         android: false,
        //         appleIcon: false,
        //         appleStartup: false,
        //         coast: false,
        //         favicons: true,
        //         firefox: true,
        //         opengraph: false,
        //         twitter: false,
        //         yandex: false,
        //         windows: false
        //     }
        // }),
        new HtmlWebpackPlugin({
            template: 'index_template.html',
            inject: true,
            title: 'StarterPack'

        }),

    ],

    resolve: {
        alias: {
            susy: path.join(__dirname, '/node_modules/susy/sass/_susy.scss')
        }
    }
};

module.exports = function (env)
{
    if (env === 'production')
    {
        return merge([
            common,
            parts.clean(PATHS.build),
            parts.define({env: env}),
            parts.loadIcons(),
            parts.loadJS(),
            parts.loadImages(),
            parts.uglifyJS(),
            parts.bundleJS(),
            parts.sourceMap('cheap-module-source-map'),
            parts.extractCSS2(),
            parts.loadFonts(),
            // ,
            parts.purifyCSS(glob.sync(path.join(PATHS.app, '**')))
            // parts.purifyCSS(glob.sync(path.join(PATHS.build, '**')))

        ]);

    }
    else
    {
        //Dev (Default) Output
        return merge([
            common,
            parts.devServer(PATHS),
            parts.loadImages(),
            parts.loadCSS(),
            parts.loadFonts(),
            parts.loadIcons(),
            parts.loadJS(),
        ])
    }
};