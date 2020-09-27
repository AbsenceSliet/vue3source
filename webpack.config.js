"use strict";

const path = require("path");
const webpack = require("webpack");
module.exports = {
  entry: {
    app: "./index.js",
  },
  devtool: "inline-source-map",
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  mode: "development",
  devServer: {
    //开发服务器
    hot: true,
    inline: true,
    open: true,
    contentBase: path.resolve(__dirname, "dist"),
    // port: "0996",
    host: "0.0.0.0",
    historyApiFallback: true,
    useLocalIp: true, //是否用自己的IP
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
};
