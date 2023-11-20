import { merge } from "webpack-merge";
import commonConfig from "./webpack.common";

const devConfig = merge(commonConfig, {
    mode: "development",
    devtool: "inline-source-map",
});

export default devConfig;
