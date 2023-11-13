const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
    entry: "/home/jrpha/dev/pp/peercast/src/ui/index.tsx",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                include: path.resolve(__dirname, "src"),
                use: [
                    {
                        loader: "ts-loader",
                    },
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    resolve: {
        extensions: [".js", ".ts", ".tsx"],
    },
    plugins: [new HtmlWebpackPlugin({ template: "./static/index.html" })],
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "dist"),
        clean: true,
    },
};
