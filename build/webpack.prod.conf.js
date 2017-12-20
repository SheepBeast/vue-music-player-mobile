var path = require('path')
var webpack = require('webpack')

var CleanWebpackPlugin = require('clean-webpack-plugin')
var ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var BabelMinifyWebpackPlugin = require('babel-minify-webpack-plugin')
var CompressionWebpackPlugin = require('compression-webpack-plugin')
var OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')

var webpackBaseConfig = require('./webpack.base.conf')
var prodConfig = require('./webpack.build.conf').production

var assetsPath = function (filename) {
  return path.join(prodConfig.assetsPath, filename)
}

var webpackConfig = require('webpack-merge')(webpackBaseConfig, {
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: assetsPath('js/[name].[chunkhash].js'),
    publicPath: '/dist/',
    chunkFilename: assetsPath('js/[name].[chunkhash].js')
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: assetsPath('img/[name].[hash:7].[ext]')
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: ExtractTextWebpackPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader']
        }),
        include: [path.resolve(__dirname, '../src')]
      },
      {
        test: /\.less$/,
        use: ExtractTextWebpackPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'less-loader']
        }),
        include: [path.resolve(__dirname, '../src')]
      }
    ]
  },
  devtool: '#source-map',
  plugins: [
    new CleanWebpackPlugin(['../dist']),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
        SERVER: prodConfig.SERVER
      }
    }),
    // UglifyJsPlugin不支持es6+语法压缩，使用babel-minify-webpack-plugin代替UglifyJsPlugin
    new BabelMinifyWebpackPlugin({
      // https://github.com/babel/minify/tree/master/packages/babel-plugin-transform-inline-consecutive-adds
      consecutiveAdds: false,
      // https://github.com/babel/minify/tree/master/packages/babel-plugin-transform-remove-console
      removeConsole: true
    }, {
        comments: false
      }),
    new ExtractTextWebpackPlugin({
      filename: assetsPath('css/[name].[contenthash].css')
    }),
    // extract-text-webpack-plugin处理后的样式代码可能依然存在同样的两份
    // optimize-css-assets-webpack-plugin可以把处理的样式的公共部分抽离出来
    new OptimizeCssAssetsWebpackPlugin({
      cssProcessorOptions: {
        safe: true
      },
      discarComments: {
        removeAll: true
      }
    }),
    new HtmlWebpackPlugin({
      title: 'vue-music-player',
      template: 'index.html',
      inject: true,
      favicon: '',
      minify: {
        minifyCSS: true,
        minifyJS: true,
        removeComments: true,
        removeAttributeQuotes: true,
        collapseWhitespace: true
      },
      hash: true,
      cache: true,
      showErrors: false,
      chunksSortMode: 'dependency'
    }),
    // 避免重新编译未改动过的文件，有利于网页缓存优化
    new webpack.HashedModuleIdsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module) {
        return module.resource && /\.js$/.test(module.resource) && module.resource.indexOf(path.join(__dirname, '../node_modules')) === 0
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']
    }),
    // 拷贝静态文件夹到编译文件中
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: assetsPath('./'),
        ignore: ['.*']
      }
    ]),
    // 压缩文件
    new CompressionWebpackPlugin({
      test: /\.(js|css|html)$/
    })
  ]
})

// 查看打包结果
if (prodConfig.bundleAnalyzerReport) {
  var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig