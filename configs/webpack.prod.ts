import * as webpack from 'webpack';
import * as merge from 'webpack-merge';

// tslint:disable-next-line:no-relative-imports
import * as common from '../webpack.bioblocks-common';

module.exports = merge(common, {
  mode: 'production',
  optimization: {
    minimize: true,
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        // tslint:disable-next-line: no-http-string
        API_URL: JSON.stringify('http://155.52.47.138:11037'),
        NODE_ENV: JSON.stringify('production'),
      },
    }),
  ],
});
