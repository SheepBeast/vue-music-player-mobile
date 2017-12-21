var http = require('http')
var path = require('path')
var app = require('express')()

var httpProxyMiddleware = require('http-proxy-middleware')

var webpackDevConfig = require('./webpack.dev.conf')
var webpackBuildConfig = require('./webpack.build.conf')

var compiler = require('webpack')(webpackDevConfig)

// 记录http请求日志
app.use(require('morgan')('dev', {
  skip: function(req, res) {
    return res.statusCode < 400
  }
}))

// 自动编译服务
app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: webpackDevConfig.output.publicPath
}))

// 热替换服务
app.use(require('webpack-hot-middleware')(compiler, webpackBuildConfig.development.hotMiddleware.query))

// api代理
var proxyTable = webpackBuildConfig.development.httpProxyMiddleware.proxyTable
Object.keys(proxyTable).forEach(function(key) {
  var options = proxyTable[key]
  if(typeof options === 'string') {
    options = { target: options }
  }
  app.use(httpProxyMiddleware(options.filter || key, options))
})

app.get('/', function(req, res) {
  res.sendFile('index.html')
})

if(require.main === module) {
  http.createServer(app).listen(process.env.PORT || 8080, '127.0.0.1', function() {
    console.log("Listening on http://127.0.0.1:8080");
  })
}