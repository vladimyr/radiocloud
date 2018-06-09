const { name, version } = require('./package.json');
const revision = require('git-rev-sync').short();

const filename = mode => mode === 'development' ? 'index.html' : '200.html';
const aliases = {
  'choices.js$': 'choices.js/assets/scripts/dist/choices.js'
};

module.exports = (options, req) => ({
  entry: './index.js',
  presets: [
    require('poi-preset-buble')()
  ],
  html: {
    version,
    revision,
    template: 'index.html',
    filename: filename(options.mode),
    appname: name
  },
  extendWebpack(config) {
    /* eslint-disable indent */
    config.module
      .rule('cson')
      .test(/\.cson$/)
      .exclude
        .add(/node_modules/)
        .end()
      .use('cson-loader')
        .loader('cson-loader');
    config.resolve.alias.merge(aliases);
    /* eslint-enable indent */
  },
  sourceMap: options.mode === 'development'
});
