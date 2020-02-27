import * as webpack from 'webpack';
import * as merge from 'webpack-merge';

// tslint:disable-next-line:no-relative-imports
import * as common from '../webpack.bioblocks-common';

console.log(process.env.API_URL);

const devConfig: webpack.Configuration = {
  devServer: {
    contentBase: './dist',
    hot: true,
    index: 'index.html',
  },
  devtool: 'inline-source-map',
  mode: 'development',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        API_URL: process.env.API_URL ? JSON.stringify(process.env.API_URL) : JSON.stringify('https://bioblocks.org'),
        NODE_ENV: process.env.NODE_ENV ? JSON.stringify(process.env.NODE_ENV) : JSON.stringify('development'),
      },
    }),
  ],
};

module.exports = merge(common, devConfig);
