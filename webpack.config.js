const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: "./src/index.ts",
    mode: "development",
    output: {
        filename: "index.js",
        path: path.resolve(__dirname, "dist"),
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Canvas Game',
            filename: 'index.html',
            template: 'src/public/index.html',
            inject: "body",
        })
    ],
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 3000,
    }
};
