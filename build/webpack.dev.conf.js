var webpack = require('webpack')

var HtmlWebpackPlugin = require('html-webpack-plugin')

var webpackBaseConfig = require('./webpack.base.conf')
var devConfig = require('./webpack.build.conf').development

var webpackConfig = require('webpack-merge')(webpackBaseConfig, {
  output: {
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        loader: 'url-loader'
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.less$/,
        loader: 'style-loader!css-loader!less-loader'
      }
    ]
  },
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"',
        SERVER: devConfig.SERVER
      }
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: 'index.html',
      inject: true
    })
  ]
})

// 添加热替换脚本到入口文件尾部
var hotMiddlewareConfig = devConfig.hotMiddleware,
  hotMiddlewareScript = [
    hotMiddlewareConfig.client,
    require('querystring').stringify(hotMiddlewareConfig.query)
  ].join('?')

Object.keys(webpackConfig.entry).forEach(function (key) {
  webpackConfig.entry[key] = [hotMiddlewareScript].concat(webpackConfig.entry[key])
})

module.exports = webpackConfig