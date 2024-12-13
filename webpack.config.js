const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const webpackNodeExternals = require('webpack-node-externals');

module.exports = {
  // Entry point for the app
  entry: path.resolve(__dirname, 'index.js'),  // This points to the entry point file (outside `src`)

  // Output configuration
  output: {
    path: path.resolve(__dirname, 'dist'),  // Bundles output here
    filename: 'index.js',  // Name of the bundle file
  },

  // For Node.js apps (since your app is backend-focused)
  target: 'node',
  externals: [webpackNodeExternals()],  // Exclude node_modules from the bundle

  mode: 'production',

  // Module rules for handling files
  module: {
    rules: [
      {
        test: /\.css$/,  // Apply to .css files
        use: ['style-loader', 'css-loader'],  // Load CSS into JS
      },
      {
        test: /\.(jpg|jpeg|png|gif|svg)$/,  // Apply to image files
        use: ['file-loader'],  // Handle image files
      },
    ],
  },

  // Plugins for copying assets and views
  plugins: [
    // Copy static assets and views into the dist directory
    new CopyPlugin({
      patterns: [
        { from: 'src/public', to: 'public' },  // Copy CSS to dist/public
        { from: 'src/views', to: 'views' },  // Copy all EJS files
      ],
    }),
  ],
};
