const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: "development",
  name: "deployment",
  entry: path.resolve(__dirname, '../src/server.ts'),
  target: "node",
  devtool: 'hidden-source-map',
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, '../dist/server'),
  },
  optimization: { usedExports: true }
};