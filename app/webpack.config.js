const path = require('path');
const webpack = require('webpack');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const I18nPlugin = require('i18n-webpack-plugin');


// Production only options
const production = {
  mode: 'production',
  cache: false,
  plugins: [],
  devtool: 'none',
};

// Development only options
const development = {
  mode: 'development',
  cache: true,
  plugins: [
    new StyleLintPlugin({
      files: '**/*.sass',
      configFile: `${__dirname}/.stylelintrc`,
    })
  ],

  devtool: 'cheap-module-source-map',
  devServer: {
    port: 3000,
    proxy: { '/api': 'http://localhost:4000' },
  },
};


let config = process.env.NODE_ENV === 'production' ? production : development;
config = {
  ...config,
  entry: 'index.jsx',

  output: {
    path: `${__dirname}/dist`,
    filename: 'bundle.js',
    libraryTarget: 'umd',
    publicPath: '/',
  },

  resolve: {
    modules: ['node_modules', __dirname],
    extensions: ['.jsx', '.js'],
  },

  module: {
    rules: [
      {
        // Check syntax and styling.
        enforce: 'pre',
        test: /\.jsx?$/,
        exclude: [/node_modules/],
        use: 'eslint-loader',
      },
      {
        // Convert markdown to HTML.
        test: /\.md$/,
        exclude: [/node_modules/],
        use: 'markdown-loader',
      },
      {
        // Transpile JSX and newer JS features.
        test: /\.jsx?$/,
        exclude: [/node_modules/],
        use: 'babel-loader',
      },
      {
        // Compile SASS, add vendor prefixes and minify CSS.
        test: /\.sass$/,
        exclude: [/node_modules/],
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
      },
    ],
  },
};

// List of available languages.
const languages = ['en'];

// Build a bundle for each available language.
module.exports = languages.map((lang) => {
  const newConfig = Object.assign({}, config);

  newConfig.plugins = [
    ...config.plugins,
    new I18nPlugin(require(`./languages/${lang}/index`)),
  ];

  newConfig.output = {
    path: `${__dirname}/dist`,
    filename: `${lang}.bundle.js`,
    libraryTarget: 'umd',
    publicPath: '/',
  };

  return newConfig;
});
