const path = require('path');
const webpack = require("webpack");
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'prod';

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, isProduction ? 'build' : 'public'),
    },
    devServer: {
        port: 8000,
        proxy: {
            '/graphql': 'http://localhost:3000/graphql'
        }
    },
    devtool: 'eval-source-map',
    module: {
        rules: [
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                })
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                minimize: isProduction
                            }
                        },
                        'postcss-loader',
                        'sass-loader'
                    ]
                })
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: 'img/[name].[ext]'
                    }
                }]
            }
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({ isProduction: true }),
        new ExtractTextPlugin({ filename: 'style.css' }),
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, 'public'),
            to: path.resolve(__dirname, 'build')
        }])
    ],
    resolve: {
        modules: [
            path.join(process.cwd(), 'src'),
            'node_modules'
        ]
    }
};
