'use strict';


const path = require('path');
const webpack = require('webpack');
const HappyPack = require('happypack');
const os = require('os');
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

let webpackConfig = {
    entry: {
        normal: './src/index.js'
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
                loader: ExtractTextPlugin.extract("style", "css")
            }, 
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract("style", 'css!sass')
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin("[name].css"),
        createHappyPlugin('js', ['babel']),
    ]
};


module.exports = webpackConfig;