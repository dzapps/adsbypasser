const fs = require('fs');
const path = require('path');

const _ = require('lodash');
const webpack = require('webpack');


const commonConfig = {
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js',
  },
  resolve: {
    alias: {
      util: path.resolve(__dirname, 'src', 'util'),
    },
  },
//   devtool: 'inline-source-map',
};


const testConfig = Object.assign({
  entry: {
    test: './tests/core.js',
  },
}, commonConfig);


const mainConfig = Object.assign({
  entry: {
    'adsbypasser.user': './src/util/main.js',
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: createMetadata({
        full: true,
      }),
      raw: true,
    }),
  ],
}, commonConfig);


const liteConfig = Object.assign({
  entry: {
    'adsbypasser.lite.user': './src/util/main.js',
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: createMetadata({
        full: false,
      }),
      raw: true,
    }),
  ],
}, commonConfig);


function createMetadata (args) {
  let metadata = fs.readFileSync('./src/util/metadata.js', {
    encoding: 'utf-8',
  });
  let packageJSON = fs.readFileSync('./package.json');
  packageJSON = JSON.parse(packageJSON);

  metadata = _.template(metadata);
  metadata = metadata({
    lite: !args.full,
    pkg: packageJSON,
  });
  metadata = [
    '// ==UserScript==\n',
    metadata,
    '// ==/UserScript==\n',
  ];
  metadata = metadata.join('');

  return metadata;
}


module.exports = [testConfig, mainConfig, liteConfig];
