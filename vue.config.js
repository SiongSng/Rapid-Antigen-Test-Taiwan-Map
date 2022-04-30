const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    devtool: 'source-map'
  },
  publicPath: '/Rapid-Antigen-Test-Taiwan-Map/'
})
