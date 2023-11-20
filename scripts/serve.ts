import webpack from "webpack";
import middleware from "webpack-dev-middleware";
import express from "express";
import config from "../webpack.dev";
import https from "https";
import fs from "fs";

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
