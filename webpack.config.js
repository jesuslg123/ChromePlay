module.exports = {
  entry: {
    background: "./js/background",
    content: "./js/content",
  },
  output: {
    path: __dirname + "/build",
    filename: "[name].bundle.js",
  },
  devtool: "source-map",
};
