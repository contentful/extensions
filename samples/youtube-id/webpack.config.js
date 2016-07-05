var path = require('path')
var HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    'app': './app.js'
  },
  output: {
    path: 'dist',
    filename: '[name].js'
  },
  plugins: [new HtmlWebpackPlugin({
    inject: true,
    // template: './index.html'
  })]
};
