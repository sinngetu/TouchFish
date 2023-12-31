const path = require('path')

const {
  override,
  fixBabelImports,
  setWebpackPublicPath,
  addDecoratorsLegacy,
  addWebpackAlias,
  overrideDevServer
} = require('customize-cra')

const { addLessLoader } = require('./webpack.extend')
const { dev, prod } = require('./core-config')
const isProd = process.env.NODE_ENV === 'production'

process.env.PORT = process.env.WDS_SOCKET_PORT = dev.port || 3000
process.env.WDS_SOCKET_HOST = dev.host
process.env.REACT_APP_API_HOST = (isProd ? prod : dev).apiHost
process.env.DISABLE_ESLINT_PLUGIN = true
isProd && (process.env.PUBLIC_URL = prod.publicUrl)

module.exports = {
  webpack: override(
    addDecoratorsLegacy(),
    addLessLoader(),

    setWebpackPublicPath(
      isProd
        ? process.env.PUBLIC_URL
        : `//${dev.host}:${dev.port}/`
    ),

    addWebpackAlias({
      '@': path.resolve(__dirname, 'src')
    }),

    fixBabelImports('import', {
      libraryName: 'antd',
      libraryDirectory: 'es',
      style: true
    }),
  ),

  devServer: overrideDevServer(config => {
    config.allowedHosts = 'all'
    config.headers = config.headers || {}
    config.headers['Access-Control-Allow-Origin'] = '*'
    config.proxy = {
      '/api': {
        target: dev.apiHost,
        pathRewrite: { '^/api': '/' },
        changeOrigin: true,
        secure: false,
        onProxyRes(proxyRes, req, res) {
          req.method === 'OPTIONS' && (proxyRes.statusCode = 200)
          proxyRes.headers['Access-Control-Allow-Origin'] = req.headers.origin
          proxyRes.headers['Access-Control-Allow-Credentials'] = true
          proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
          proxyRes.headers['Access-Control-Allow-Headers'] = 'content-type, authorization, accept-language'
        }
      }
    }

    return config
  })
}
