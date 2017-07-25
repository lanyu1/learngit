'use strict'

const WebpackDevServer = require('webpack-dev-server')
const config = require('../webpack/webpack.dev')
const webpack = require('webpack')
var path = require('path');

var compiler = webpack(config)

var server = new WebpackDevServer(compiler, 
  {
        hot: true,
        contentBase: path.resolve(__dirname, "../../dist"),
        port: 9090,
        host: "0.0.0.0",
        publicPath: "/",
        historyApiFallback: true,
        disableHostCheck: true,
        proxy: {
            "/api/**": {
                "target": "http://localhost:8000/",
                "changeOrigin": true
            }
        }
    })

server.listen(9090, 'localhost', function (err) {
  if (err) throw err
})
