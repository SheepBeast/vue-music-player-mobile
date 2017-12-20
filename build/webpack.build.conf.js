module.exports = {
  development: {
    // 热替换脚本
    hotMiddleware: {
      client: 'webpack-hot-middleware/client',
      query: {
        noInfo: true,
        path: '/__webpack_hmr',
        timeout: 20000,
        heartbeat: 10000,
        reload: true
      }
    },
    httpProxyMiddleware: {
      // 代理列表
      proxyTable: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          pathRewrite: {
            '^/api': ''
          }
        }
      }
    },
    // 编译所有process.env.SERVER，在src/api/index.js使用
    SERVER: '"/api"'  // 开发环境api代理
  },
  production: {
    // 打包后的静态文件夹名
    assetsPath: 'static',
    // 作用同上
    SERVER: '"http://39.106.10.121"', // 线上环境api域名
    // 打包后是否查看报告
    bundleAnalyzerReport: false
  }
}