'use strict';

const path = require('path');
const chalk = require('chalk');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');

const utils = require('./src/js/utils/utils');

const devMode = process.env.NODE_ENV !== 'production';

function generateProgressBarPlugin (name) {
  const building = chalk.bold(`Building ${name} page...`);
  const bar = chalk.bgBlue.white.bold('[:bar]');
  const percent = chalk.bold.green(':percent');
  const elapsed = chalk.bold('(:elapsed seconds)');

  return new ProgressBarPlugin({
    format: `   ${building} ${bar} ${percent} ${elapsed}`,
    clear: false,
  });
}

const outputPath = path.resolve(
  __dirname,
  'dist',
);
const demoOutputPath = path.resolve(
  outputPath,
  'demos',
);

function generateConfig (name, entry) {
  return {
    name,
    entry: {
      // @see - https://github.com/webpack-contrib/webpack-serve/issues/27
      [name]: [
        entry,
      ],
    },
    output: {
      path: outputPath,
      filename: '[name].js',
      libraryTarget: 'umd',
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
          },
          // @see - https://github.com/webpack/webpack/issues/2031
          include: [
            path.resolve(
              __dirname,
              'src'
            ),
            path.resolve(
              __dirname,
              'demos'
            ),
            // @see - https://github.com/visionmedia/debug/issues/668
            path.resolve(
              __dirname,
              'node_modules',
              'debug'
            ),
          ],
        },
        // @see - https://github.com/bensmithett/webpack-css-example/blob/master/webpack.config.js
        {
          test: /\.(eot|svg|ttf|woff|woff2)$/,
          loader: 'url-loader',
        },
        {
          // @see - https://github.com/webpack-contrib/mini-css-extract-plugin
          // @see - https://github.com/webpack-contrib/sass-loader
          test: /\.(sa|sc|c)ss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: devMode,
              },
            },
            'css-loader',
            // @todo
            // 'postcss-loader',
            'sass-loader',
          ],
        },
      ],
    },
    resolve: {
      alias: {
        '~root': __dirname,
      },
    },
    plugins: [
      generateProgressBarPlugin(name),
      new MiniCssExtractPlugin({
        filename: devMode
          ? '[name].css'
          : '[name].[hash].css',
        chunkFilename: devMode
          ? '[id].css'
          : '[id].[hash].css',
      }),
      new WriteFilePlugin(),
    ],
  };
}

const advancedDemoDistConfig = generateConfig(
  'advanced-dist',
  path.resolve(
    __dirname,
    'demos',
    'advanced-dist',
    'index.js',
  ),
);

advancedDemoDistConfig.output.path = demoOutputPath;

const advancedDemoSrcConfig = generateConfig(
  'advanced-src',
  path.resolve(
    __dirname,
    'demos',
    'advanced-src',
    'index.js',
  ),
);

advancedDemoSrcConfig.output.path = demoOutputPath;

const simpleDemoSrcConfig = generateConfig(
  'simple-src',
  path.resolve(
    __dirname,
    'demos',
    'simple-src',
    'index.js',
  ),
);

simpleDemoSrcConfig.output.path = demoOutputPath;

const tourDemoSrcConfig = generateConfig(
  'tour-src',
  path.resolve(
    __dirname,
    'demos',
    'tour-src',
    'index.js',
  ),
);

tourDemoSrcConfig.output.path = demoOutputPath;

const clspPlayerConfig = generateConfig(
  utils.name,
  path.resolve(
    __dirname,
    'src',
    'js',
    'index.js',
  ),
);

module.exports = function () {
  return [
    advancedDemoDistConfig,
    advancedDemoSrcConfig,
    simpleDemoSrcConfig,
    tourDemoSrcConfig,
    clspPlayerConfig,
  ];
};
