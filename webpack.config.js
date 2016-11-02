const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devServer: {
    proxy: {
      '**': {target: 'http://localhost:3000', secure:false},
    }
  },
  // specifies the entry files
  // when provided with array it will go through all the files
  entry: {
    index: './client/index.jsx'
  },
  // allows testing with enzyme
  externals: {
    'react/addons': true,
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true
  },
  // specifies where webpack will dump the compiled files
  output: {
    path: './public',
    filename: 'bundle.js',
  },
  // loader specifies the preprocessor
  module: {
    loaders: [
      {
        test: /\.jsx?/,
        loader: 'babel',
        include: path.join(__dirname, 'client')
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader"
      }
    ]
  },
 // additional functionality. htmlwebpackplugin or minify goes here
 plugins: [
   // Auto generate our html page https://www.npmjs.com/package/html-webpack-plugin
   new HtmlWebpackPlugin({
     template: path.join(__dirname, 'client/index.html'),
     appMountId: 'App',
     title: 'Index',
   })
 ]
};

