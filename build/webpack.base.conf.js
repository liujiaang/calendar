var path = require('path')
var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  entry: {
    app: ["babel-polyfill", './src/main.js']
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src')
    }
  },
  plugins: [
  ],
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            limit: 1000,
            name: utils.assetsPath('img/[name].[hash:7].[ext]'),
          }
        },
          {
            loader: 'image-webpack-loader',//新增image-webpack-loader
            options: {
              mozjpeg: {//设置对jpg格式的图片压缩的程度设置
                progressive: true,
                quality: 65
              },
              optipng: {//设置对jpg格式的图片压缩的程度设置
                progressive: true,
                quality: 65
              },
              pngquant: {//设置对jpg格式的图片压缩的程度设置
                progressive: true,
                quality: 65
              },
              svgo: {//设置对jpg格式的图片压缩的程度设置
                progressive: true,
                quality: 65
              },
              gifsicle: {//设置对jpg格式的图片压缩的程度设置
                progressive: true,
                quality: 65
              },
            }
          }
        ]
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 100000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 100000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  }
}
