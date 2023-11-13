const webpack = require("webpack");
const middleware = require("webpack-dev-middleware");
const express = require("express");
const config = require("../webpack.config");
const https = require("https");
const fs = require("fs");

const app = express();

const compiler = webpack(config);

const PORT = 8080;

app.use(
    middleware(compiler, {
        // webpack-dev-middleware options
    }),
);

const options = {
    key: fs.readFileSync("./certs/privkey.pem"),
    cert: fs.readFileSync("./certs/fullchain.pem"),
};

https
    .createServer(options, app)
    .listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
