const DashboardPlugin = require('webpack-dashboard/plugin')
var path = require('path');
var webpack = require('webpack');
var merge = require('webpack-merge');
var webpackConfig = require('./webpack.config');

process.env.NODE_ENV = 'development';

module.exports = merge(webpackConfig, {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'babel-polyfill',
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://localhost:8000',
    'webpack/hot/only-dev-server',
    "./src/index"
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app/[name]_[hash:8].js',
    chunkFilename: 'app/chunks/[name].[chunkhash:5].chunk.js',
  },
  watch: true,
  module: {
    rules: [{
      test: /\.css$/,
      use: [{
        loader: 'style-loader'
      }, {
        loader: 'css-loader'
      }]
    }]
  },
  plugins: [
    new DashboardPlugin(),
    new webpack.LoaderOptionsPlugin({
      debug: true
    }),
    //new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      // 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      // 'process.env.AUTH_HOST': JSON.stringify('http://10.211.111.19:8080/oauth'),
      // 'process.env.CLIENT_ID': JSON.stringify('client'),
      // 'process.env.REDIRECT_URL': JSON.stringify('http://localhost:9090'),
      // 'process.env.API_HOST': JSON.stringify('http://10.211.111.19:8080'),
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        'process.env.AUTH_HOST': JSON.stringify('http://kanban.hapcloud.cloud.saas.hand-china.com/oauth'),
            'process.env.CLIENT_ID': JSON.stringify('client'),
    'process.env.REDIRECT_URL': JSON.stringify('http://localhost:9090'),
    'process.env.API_HOST': JSON.stringify('http://kanban.hapcloud.cloud.saas.hand-china.com'),


}),
  ],
});
