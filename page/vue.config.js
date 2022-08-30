const path = require('path')
const CompressionPlugin = require('compression-webpack-plugin')

function resolve(dir) {
  return path.join(__dirname, dir)
}
const config = {
  productionSourceMap: false,
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.md$/,
          use: [
            'html-loader',
            'marked-essay-loader'
          ]
        }
      ]
    },
    // 路径配置
    resolve: {
      // 别名配置
      alias: {
        '@plugin': resolve('./dlSmartForm'),
        '@pr': resolve('./packages')
      }
    }
  },
  chainWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置
      config
        .plugin('compression')
          .use(CompressionPlugin)
          .tap(options => {
            options.test = /\.js$|\.html$|\.css/ // 匹配文件名
            options.threshold = 30 * 1024 // 对超过20k的数据压缩
            options.deleteOriginalAssets = false // 不删除源文件
            return options
          })  
      config
        .plugin('webpack-bundle-analyzer')
        .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin);
    } 
  }
}

if (process.env.smartForm == 1) {
  config.outputDir = 'dlSmartForm'
  config.configureWebpack.externals = {
    vue: 'vue'
  }
} else {
  config.publicPath = '/dlSmartForm/'
}
module.exports = config
