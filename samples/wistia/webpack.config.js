var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');

module.exports = {
  entry: './src/app.js',
  output: {
    path: __dirname + '/dist/',
    publicPath: '',
    filename: 'bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Wistia Widget',
      inject: false,
      cache: false,
      template: 'ejs!./src/templates/widget.ejs',
      filename: 'index.html',
    }),
    new webpack.ProvidePlugin({
      _: 'underscore'
    })
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      }
    ],

  }
};