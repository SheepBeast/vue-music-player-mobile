var path = require('path')

var webpackConfig = {
  entry: {
    main: './src/main.js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: path.resolve(__dirname, './src')
      }
    ]
  },
  resolve: {
    modules: [path.resolve(__dirname, '../src'), path.resolve(__dirname, '../node_modules')],
    extensions: ['.js', '.json', '.vue', '.less']
  },
  // 外部引用库，减少打包后的体积
  externals: {
    Vue: 'vue',
    VueRouter: 'vue-router',
    VueResource: 'vue-resource',
    Vuex: 'vuex'
  }
}

module.exports = webpackConfig