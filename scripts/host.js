const webpack = require("webpack");
const middleware = require("webpack-dev-middleware");
const express = require("express");
const config = require("../webpack.config");

const app = express();

const compiler = webpack(config);

app.use(
    middleware(compiler, {
        // webpack-dev-middleware options
    }),
);

app.listen(3000, () => console.log("Example app listening on port 3000!"));
