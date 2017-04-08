const fs = require('fs');
const path = require('path');

const _ = require('lodash');
const glob = require('glob');
const webpack = require('webpack');


const commonConfig = {
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js',
  },
  resolve: {
    alias: {
      handlers: path.resolve(__dirname, 'build', 'handlers.js'),
    },
    modules: [
      path.resolve(__dirname, 'src'),
      'node_modules',
    ],
  },
};


const testConfig = Object.assign({
  entry: {
    test: './tests/core.js',
  },
}, commonConfig);


const mainConfig = Object.assign({
  entry: {
    'adsbypasser.user': createEntryPoint({
      withImage: true,
    }),
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: createMetadata({
        withImage: true,
      }),
      raw: true,
    }),
  ],
}, commonConfig);


const liteConfig = Object.assign({
  entry: {
    'adsbypasser.lite.user': createEntryPoint({
      withImage: false,
    }),
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: createMetadata({
        withImage: false,
      }),
      raw: true,
    }),
  ],
}, commonConfig);


function createMetadata (args) {
  let metadata = fs.readFileSync('./src/util/metadata.js', {
    encoding: 'utf-8',
  });
  let packageJSON = fs.readFileSync('./package.json', {
    encoding: 'utf-8',
  });
  packageJSON = JSON.parse(packageJSON);

  metadata = _.template(metadata);
  metadata = metadata({
    lite: !args.withImage,
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


function createEntryPoint (args) {
  const files = glob.sync('./src/sites/file/**.js');
  const images = glob.sync('./src/sites/image/**.js');
  const links = glob.sync('./src/sites/link/**.js');
  const pastes = glob.sync('./src/sites/paste/**.js');

  let handlers = [].concat(files, links, pastes);
  if (args.withImage) {
    handlers = handlers.concat(images);
  }

  let handler = 'import {_, $} from \'util/public\';\n';
  fs.writeFileSync('./build/handlers.js', handler, {
    encoding: 'utf-8',
    mode: 0644,
    flag: 'w',
  });

  handlers.forEach((filePath) => {
    let handler = fs.readFileSync(filePath);
    fs.writeFileSync('./build/handlers.js', handler, {
      encoding: 'utf-8',
      mode: 0644,
      flag: 'a',
    });
  });

  return './src/util/main.js';
}


module.exports = [testConfig, mainConfig, liteConfig];
