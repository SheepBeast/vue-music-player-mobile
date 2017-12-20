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
    extensions: ['.js', '.json', '.vue', '.less'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
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