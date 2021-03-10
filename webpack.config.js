const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './index.js',
    output: {
        // path: path.resolve(__dirname, 'dist'),
        // filename: 'index.js',
        filename: '[name].bundle.js',
        publicPath: '/clientapp/dist/',
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    "style-loader", // creates style nodes from JS strings
                    "css-loader", // translates CSS into CommonJS
                    "sass-loader" // compiles Sass to CSS, using Node Sass by default
                ]
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
    devServer: {
        // host: '192.168.1.121',//your ip address
        port: 9000,
        hot: true
    }
};