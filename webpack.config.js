const fs = require('fs');
const path = require('path');

const _ = require('lodash');
const webpack = require('webpack');
const glob = require('glob');
const mkdirp = require('mkdirp');


const handlersPath = {
  common: path.resolve(__dirname, 'build', 'handlers', 'common.js'),
  image: path.resolve(__dirname, 'build', 'handlers', 'image.js'),
};


const commonConfig = {
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js',
  },
  resolve: {
    alias: {
      'handlers_common': handlersPath.common,
      'handlers_image': handlersPath.image,
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
    'adsbypasser.user': './src/util/main.js',
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: createMetadata({
        withImage: true,
      }),
      raw: true,
    }),
    new webpack.NormalModuleReplacementPlugin(/^__HANDLERS__$/, (resource) => {
      resource.request = 'handlers_image';
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
        withImage: false,
      }),
      raw: true,
    }),
    new webpack.NormalModuleReplacementPlugin(/^__HANDLERS__$/, (resource) => {
      resource.request = 'handlers_common';
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


function prepareCommonHandlers (outputPath) {
  mkdirp.sync(path.dirname(outputPath));

  const files = glob.sync('./src/sites/file/**.js');
  const links = glob.sync('./src/sites/link/**.js');
  const pastes = glob.sync('./src/sites/paste/**.js');
  let handlers = [].concat(files, links, pastes);

  let handler = 'import {_, $} from \'util/public\';\n';
  fs.writeFileSync(outputPath, handler, {
    encoding: 'utf-8',
  });

  handlers.forEach((filePath) => {
    let handler = fs.readFileSync(filePath);
    fs.writeFileSync(outputPath, handler, {
      encoding: 'utf-8',
      flag: 'a',
    });
  });
}


function prepareImageHandlers (outputPath) {
  mkdirp.sync(path.dirname(outputPath));

  const images = glob.sync('./src/sites/image/**.js');

  let handler = 'import {_, $} from \'util/public\';\nimport \'handlers_common\';\n';
  fs.writeFileSync(outputPath, handler, {
    encoding: 'utf-8',
  });

  images.forEach((filePath) => {
    let handler = fs.readFileSync(filePath);
    fs.writeFileSync(outputPath, handler, {
      encoding: 'utf-8',
      flag: 'a',
    });
  });
}


prepareCommonHandlers(handlersPath.common);
prepareImageHandlers(handlersPath.image);


module.exports = [testConfig, mainConfig, liteConfig];
