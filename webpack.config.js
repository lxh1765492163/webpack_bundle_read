const path = require('path');
module.exports = {
    entry: './index.js',
    mode: 'development',
    devtool:"source-map",
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.bundle.js'
    },
    // module: {
    //     rules: [
    //       {
    //         test: /\.m?js$/,
    //         exclude: /(node_modules|bower_components)/,
    //         use: {
    //           loader: 'babel-loader',
    //         }
    //       }
    //     ]
    // }
}