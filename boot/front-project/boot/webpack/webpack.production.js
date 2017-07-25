var webpack = require('webpack');
var merge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpackConfig = require('./webpack.config');
var CopyWebpackPlugin = require('copy-webpack-plugin');

process.env.NODE_ENV = 'production';

module.exports = merge(webpackConfig, {
  module: {
    rules: [{
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        fallback: "style-loader",
        use: "css-loader"
      }),
    }],
  },
  entry: [
    'babel-polyfill',
    "./src/index.prod"
  ],
  plugins: [
    new ExtractTextPlugin({
      filename:'[name]_[contenthash].css',
      allChunks: true,
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      output: {
        comments: false,  // remove all comments
      },
      compress: {
        warnings: true,
      }
    }),
    // Transfer Files
    /*new CopyWebpackPlugin([
      {from: 'src/www/css', to: 'css'},
      {from: 'src/www/images', to: 'images'}
    ]),*/
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
      'process.env.AUTH_HOST': JSON.stringify(`${process.env.API_HOST}/oauth`),
      'process.env.CLIENT_ID': JSON.stringify('client'),
      'process.env.REDIRECT_URL': JSON.stringify(process.env.CONSOLE_HOST),
      'process.env.API_HOST': JSON.stringify(process.env.API_HOST)
    }),
    new webpack.optimize.CommonsChunkPlugin({
        names: ['vendor', 'manifest'],
    })
  ],
});
