var path = require('path');
var webpack = require('webpack');
var fs = require('fs');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var DirectoryNamedWebpackPlugin = require('directory-named-webpack-plugin');
var paths = require('../../config/paths');
var getClientEnvironment = require('../../config/env');

// Webpack uses `publicPath` to determine where the app is being served from.
// In development, we always serve from the root. This makes config easier.
var publicPath = '/';
// `publicUrl` is just like `publicPath`, but we will provide it to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_PATH%/xyz looks better than %PUBLIC_PATH%xyz.
var publicUrl = '';

// Get environment variables to inject into our app.
var env = getClientEnvironment(publicUrl);

module.exports = {
  devtool: 'eval',
  entry: {
    bundle : [
      'webpack-hot-middleware/client',
      'webpack/hot/only-dev-server',
      'react-hot-loader/patch',
      require.resolve('../polyfills'),
      paths.appIndexJs
    ]
  },
  output: {
    path: paths.appBuild,
    filename: 'scripts/[name].js',
    publicPath: publicPath
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'eslint-loader',
        include: paths.appSrc,
        enforce: 'pre'
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: paths.appSrc,
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[name]__[local]___[hash:base64:5]',
              importLoaders: 1,
              sourceMap: 1
            }
          }
        ]
      },
      {
        test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          name: 'media/[name].[hash:8].[ext]'
        }
      },
      // 'url' loader works just like 'file' loader but it also embeds
      // assets smaller than specified size as data URLs to avoid requests.
      {
        test: /\.(mp4|webm|wav|mp3|m4a|aac|oga)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'media/[name].[hash:8].[ext]'
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: 'body',
      template: paths.appHtml
    }),
    new webpack.DefinePlugin(env),
    new webpack.HotModuleReplacementPlugin()
  ],
  resolve: {
    modules: [
      paths.appSrc,
      paths.appNodeModules
    ],
    extensions: ['.js', '.css'],
    plugins: [
      new DirectoryNamedWebpackPlugin(true),
    ]
  }
};
