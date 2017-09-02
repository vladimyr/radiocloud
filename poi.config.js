const { version } = require('./package.json');
const revision = require('git-rev-sync').short();

const filename = mode => mode === 'development' ? 'index.html' : '200.html';

module.exports = (options, req) => ({
  entry: './index.js',
  presets: [
    require('poi-preset-buble')()
  ],
  html: {
    version,
    revision,
    template: 'index.html',
    filename: filename(options.mode)
  },
  sourceMap: options.mode === 'development'
});
