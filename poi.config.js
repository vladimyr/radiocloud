'use strict';

const { name, version } = require('./package.json');
const revision = require('git-rev-sync').short();

const aliases = {
  'choices.js$': 'choices.js/public/assets/scripts/choices.js'
};
const isProduction = process.env.NODE_ENV === 'production';

/** @type {import('poi').Config} */
const config = {
  plugins: [
    '@poi/bundle-report'
  ],
  entry: './index.js',
  output: {
    html: {
      version,
      revision,
      template: 'index.html',
      filename: isProduction ? '200.html' : 'index.html',
      appname: name
    },
    sourceMap: !isProduction
  },
  chainWebpack(config) {
    config.resolve.alias.merge(aliases);
    /* eslint-disable indent */
    config.module.rule('aot')
      .test(/\.js$/)
      .enforce('pre')
      .resourceQuery(/\?aot$/)
      .exclude
        .add(/node_modules/)
        .end()
      .use('aot-loader')
        .loader(require.resolve('aot-loader'));
    /* eslint-enable indent */
  }
};

module.exports = config;
