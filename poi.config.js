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
    config.resolve.alias.merge(aliases);
  },
  sourceMap: options.mode === 'development'
});
