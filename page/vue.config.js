const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}
const config = {
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
        '@pr': resolve('./packages')
      }
    }
  }
}

if (process.env.smartForm == 1) {
  config.outputDir = 'dlSmartForm'
  config.configureWebpack.externals = {
    vue: 'vue'
  }
}
module.exports = config
