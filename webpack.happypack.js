'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const webpack = require('webpack');
const HappyPack = require('happypack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const createHappyPlugin = function (id, loaders) {
    return new HappyPack({
        id: id,
        loaders: loaders,
        threadPool: HappyPack.ThreadPool({size: os.cpus().length }),
        cache: true,
        verbose: true
    });
};

const env = process.env.NODE_ENV;

let webpackConfig = {
    entry: {
        happyPack: './src/index.js'
    },
    output: {
        path: path.join(__dirname, process.env.BUILD_DEST ||'build'),
        filename: '[name].js',
        publicPath: '/static/'
    },
    externals: {},
    resolve: {
        alias: {
            'common': path.join(__dirname, 'src/common/index.scss')
        }
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: "happypack/loader?id=js",
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style", "happypack/loader?id=css")
            }, 
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract("style", "happypack/loader?id=scss")
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin("[name].css"),
        createHappyPlugin('css', ['css']),
        createHappyPlugin('js', ['babel']),
        createHappyPlugin('scss', ["css", "sass-loader" ]),
    ]
};


module.exports = webpackConfig;