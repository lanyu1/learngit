var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');
//处理 BashOnWindow 下的打包错误
try {
  require('os').networkInterfaces()
} catch (e) {
  require('os').networkInterfaces = () => ({})
}
module.exports = {
  entry: {
    // include all?
    vendor: ["react", "react-dom", "react-router-dom", "antd"],
    app: [
      path.resolve(__dirname, '../src/index.js')
    ]
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'app/[name]_[hash:8].js',
    chunkFilename: 'app/chunks/[name].[chunkhash:5].chunk.js',
  },
  resolve: {
    modules: [path.resolve(__dirname, '../src'), 'src/lib', 'node_modules'],
    extensions: ['.js', '.json', '.jsx', '.ts', '.less'],
  },
  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      loader: "babel-loader"
    }, {
      test: /\.(tsx?$)/,
      use: [{
        loader: 'ts-loader'
      }],
      exclude: /node_modules/,
    },
    {
      test: /\.less$/,
      use: [{
        loader: 'style-loader'
      }, {
        loader: 'css-loader'
      }, {
        loader: 'less-loader'
      }],
      exclude: /node_modules/,
    }, {
      test: /\.(jpe?g|png|gif|svg|ico)/i,
      use: [{
        loader: 'file-loader',
        options: {
          name: 'img_[hash:8].[ext]'
        }
      }]
    }, {
      test: /\.(ttf|eot|svg|woff|woff2)/,
      use: [{
        loader: 'file-loader'
      }]
    }],
  },
  // eslint: {
  //   configFile: './.eslintrc',
  // },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'HAP',
      template: path.resolve(__dirname, '../src/index.template.html'),
      inject: true,
      minify: {
        html5: true,
        collapseWhitespace: true,
        // conservativeCollapse: true,
        removeComments: true,
        removeTagWhitespace: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
      }
    }),
  ]
};
