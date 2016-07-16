var WebpackDevServer = require("webpack-dev-server");
var webpack = require("webpack");
var config = require("./webpack.config.js");
config.entry.app =[];
config.entry.app.unshift("webpack-dev-server/client?http://localhost:4000/", "webpack/hot/dev-server");
var compiler = webpack(config);
var server = new WebpackDevServer(compiler, {
  contentBase: "dist",
  hot: true,
});
server.listen(4000, function() {
  console.log('4000');
});
