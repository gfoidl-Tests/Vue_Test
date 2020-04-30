const { CleanWebpackPlugin }     = require("clean-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const HtmlWebpackPlugIn          = require("html-webpack-plugin");
const MiniCssExtractPlugIn       = require("mini-css-extract-plugin");
const OptimizeCssPlugIn          = require("optimize-css-assets-webpack-plugin");
const path                       = require("path");
const TerserPlugin               = require("terser-webpack-plugin");
const VueLoaderPlugin            = require("vue-loader/lib/plugin");
const Webpack                    = require("webpack");

module.exports = (env, argv) => {
    const devMode = env !== "production" && argv.mode !== "production";

    if (devMode) {
        console.log("Development mode");
    } else {
        console.log("Production mode");
    }

    const config = {
        mode   : devMode ? "development" : "production",
        context: path.resolve(__dirname, "src/ts"),     // resolve vs. join -> https://stackoverflow.com/a/39836259/347870
        entry  : {
            app: "./app"
        },
        resolve: {
            extensions: [".ts", ".vue", ".js"],         // when 'resolve' is not specified, in entry the extension has to be given
            alias: {
                "@"   : path.resolve(__dirname, "src/ts"),
                "@svc": path.resolve(__dirname, "src/ts/services"),
                // Note: alias not needed when vue is in 'externals', as long the name matches
                vue$  : "vue/dist/vue.esm.js"           // https://forum.vuejs.org/t/vue-2-0-warn-you-are-using-the-runtime-only-build-of-vue-where-the-template-compiler-is-not-available/9429/3
            }
        },
        output: {
            //publicPath: "/",                          // essential to create relative path to root (HtmlWebpackPlugIn)
            publicPath: "/assets/",                     // final / is essential, otherwise wrong urls are generated by e.g. image-loader
            path      : path.resolve(__dirname, "dist/assets"),
            filename  : devMode ? "[name].js" : "[name].[hash].js"
        },
        module: {
            rules: [
                {
                    test   : /\.tsx?$/,
                    loader : "ts-loader",
                    exclude: /node_modules/,
                    options: {
                        transpileOnly       : true,     // ForkTsCheckerWebpackPlugin is used for compilation errors
                        experimentalWatchApi: true,
                        appendTsSuffixTo    : [/\.vue$/]
                    }
                },
                {
                    test  : /\.vue$/,
                    loader: "vue-loader"
                },
                // below is for assets -> https://webpack.js.org/guides/asset-management/
                {
                    test: /\.(le|c)ss$/,
                    use : [
                        {
                            loader: MiniCssExtractPlugIn.loader,
                            options: {
                                publicPath: "../styles/",
                                hmr: devMode
                            }
                        },
                        "css-loader",
                        "less-loader"
                    ]
                },
                {
                    test  : /\.(png|svg|jpg|gif)$/,
                    //loader: "file-loader"
                    //loader: "url-loader"                // dataUri for small images, otherwise similar to file-loader
                    use: [
                       {
                            loader: "url-loader",
                            options: {
                                limit: 50000              // bytes
                            }
                       }
                    ]
                }
            ]
        },
        plugins: [
            new CleanWebpackPlugin(),
            new Webpack.DefinePlugin({
                __DEBUG__: JSON.stringify(devMode)
            }),
            new VueLoaderPlugin(),
            new ForkTsCheckerWebpackPlugin({
                tsconfig: path.resolve(__dirname, "tsconfig.json"),
                async      : false,
                memoryLimit: 4096,
                vue        : true
            }),
            new HtmlWebpackPlugIn({
                template: "../index.html",
                filename: path.resolve(__dirname, "dist/index.html")
            }),
            new MiniCssExtractPlugIn({
                filename     : devMode ? "[name].css" : "[name].[hash].css",
                chunkFilename: devMode ? "[id].css"   : "[id].[hash].css"
            })
        ],
        optimization: {
            runtimeChunk: "single",
            splitChunks : {                             // https://webpack.js.org/plugins/split-chunks-plugin/
                chunks     : "all",
                cacheGroups: {
                    common: {
                        name     : "app-common",
                        chunks   : "initial",
                        minChunks: 2
                    },
                    vendors: {
                        test  : /[\\/]node_modules[\\/]/,
                        name  : "common",
                        chunks: "initial"
                    }
                }
            },
            minimizer: [
                new TerserPlugin({}),
                new OptimizeCssPlugIn({})
            ]
        },
        devtool: "cheap-source-map",                    // https://webpack.js.org/configuration/devtool/
        devServer: {
            contentBase       : path.resolve(__dirname, "dist"),
            historyApiFallback: true
            // proxy doesn't work with Windows-Auth
            //proxy             : {
            //  "/api": "http://localhost:58712"
            //}
        }
    };

    return config;
};
