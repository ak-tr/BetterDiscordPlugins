const pkg = require("./package.json");
const pluginConfig = require("./src/config.json");
const webpack = require("webpack");
const path = require("path");

pluginConfig.version = pkg.version;

const meta = (() => {
    const lines = ["/**"];
    for (const key in pluginConfig) {
        lines.push(` * @${key} ${pluginConfig[key]}`);
    }
    lines.push(" */");
    return lines.join("\n");
})();

module.exports = {
    mode: "development",
    target: "node",
    devtool: false,
    entry: "./src/index.ts",
    output: {
        filename: "PasteAndSend.plugin.js",
        path: path.join(__dirname, "dist"),
        libraryTarget: "commonjs2",
        libraryExport: "default",
        compareBeforeEmit: false,
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    plugins: [new webpack.BannerPlugin({ raw: true, banner: meta })],
};
