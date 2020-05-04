const { CleanWebpackPlugin }     = require("clean-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const GitRevisionPlugin          = require("git-revision-webpack-plugin");
const HtmlWebpackPlugIn          = require("html-webpack-plugin");
const MiniCssExtractPlugIn       = require("mini-css-extract-plugin");
const OptimizeCssPlugIn          = require("optimize-css-assets-webpack-plugin");
const path                       = require("path");
const svgToMiniDataUri           = require("mini-svg-data-uri");
const TerserPlugin               = require("terser-webpack-plugin");
const TsconfigPathsPlugin        = require("tsconfig-paths-webpack-plugin");
const VueLoaderPlugin            = require("vue-loader/lib/plugin");
const Webpack                    = require("webpack");
//-----------------------------------------------------------------------------
module.exports = (env, argv) => {
    const devMode = env !== "production" && argv.mode !== "production";

    if (devMode) {
        console.log("Development mode");
    } else {
        console.log("Production mode");
    }

    const tsConfigFile      = path.resolve(__dirname, "src", "tsconfig.json");
    const gitRevisionPlugin = new GitRevisionPlugin();

    const config = {
        mode   : devMode ? "development" : "production",
        context: path.resolve(__dirname, "src", "ts"),  // resolve vs. join -> https://stackoverflow.com/a/39836259/347870
        entry  : {
            app: "./app"
        },
        resolve: {
            extensions: [".ts", ".vue", ".js"],         // when 'resolve' is not specified, in entry the extension has to be given
            // TsconfigPathsPlugin is used to automate this
            //alias: {
                //"@"   : path.resolve(__dirname, "src", "ts"),
                //"@svc": path.resolve(__dirname, "src", "ts", "services"),

                // Note: alias not needed when vue is in 'externals', as long the name matches
                // Note2: runtime only can be used when there are no template-strings used -- see app.ts for more info
                //vue$  : "vue/dist/vue.esm.js"         // https://forum.vuejs.org/t/vue-2-0-warn-you-are-using-the-runtime-only-build-of-vue-where-the-template-compiler-is-not-available/9429/3
            //},
            plugins: [new TsconfigPathsPlugin({ configFile: tsConfigFile })]
        },
        output: {
            path    : path.resolve(__dirname, "dist", "assets"),
            filename: devMode ? "[name].js" : "[name].[hash].js"
        },
        module: {
            rules: [
                {
                    test   : /\.ts$/,
                    loader : "ts-loader",
                    exclude: /node_modules/,
                    options: {
                        transpileOnly       : true,     // ForkTsCheckerWebpackPlugin is used for compilation errors
                        experimentalWatchApi: true,
                        appendTsSuffixTo    : [/\.vue$/]
                    }
                },
                {
                    test   : /\.vue$/,
                    loader : "vue-loader",
                    options: {
                        // https://bootstrap-vue.org/docs/reference/images
                        transformAssetUrls: {
                            video             : ["src", "poster"],
                            source            : "src",
                            img               : "src",
                            image             : "xlink:href",
                            "b-avatar"        : "src",
                            "b-img"           : "src",
                            "b-img-lazy"      : ["src", "blank-src"],
                            "b-card"          : "img-src",
                            "b-card-img"      : "src",
                            "b-card-img-lazy" : ["src", "blank-src"],
                            "b-carousel-slide": "img-src",
                            "b-embed"         : "src"
                        }
                    }
                },
                // below is for assets -> https://webpack.js.org/guides/asset-management/
                {
                    test: /\.(le|c)ss$/,
                    use : [
                        {
                            loader: MiniCssExtractPlugIn.loader,
                            options: {
                                esModule: true,         // enables e.g. tree-shaking
                                hmr     : devMode
                            }
                        },
                        "css-loader",
                        "less-loader"
                    ]
                },
                {
                    test: /\.(png|jpg|gif)$/i,
                    use : [
                        {
                            loader : "url-loader",
                            options: {
                                esModule  : false,      // https://github.com/vuejs/vue-loader/issues/1612    
                                limit     : 8192,       // bytes
                                publicPath: "assets/"
                            }
                        }
                    ]
                },
                {
                    test: /\.svg$/i,
                    use : [
                        {
                            loader : "url-loader",
                            options: {
                                esModule : false,       // see above
                                generator: content => svgToMiniDataUri(content.toString())
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [
            gitRevisionPlugin,
            new Webpack.DefinePlugin({
                __DEBUG__: JSON.stringify(devMode),
                VERSION  : JSON.stringify(gitRevisionPlugin.version())
            }),
            new VueLoaderPlugin(),
            new ForkTsCheckerWebpackPlugin({
                tsconfig   : tsConfigFile,
                async      : false,
                memoryLimit: 4096,
                vue        : true
            }),
            new HtmlWebpackPlugIn({
                template: "../index.html",
                filename: path.resolve(__dirname, "dist", "index.html")
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
                    app: {
                        name     : "app-common",
                        chunks   : "initial",
                        minChunks: 2
                    },
                    common: {
                        test  : /[\\/]node_modules[\\/]/,
                        name  : "common",
                        chunks: "all"
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

    // Inject CleanWebpackPlugin when not using dev-server. With the dev-server
    // there is a deadlock anywhere :-(
    const runsInDevServer = /webpack-dev-server.js$/.test(argv.$0);
    if (!runsInDevServer) {
        config.plugins.unshift(new CleanWebpackPlugin());
        console.log("added CleanWebpackPlugin");
    }

    return config;
};
//-----------------------------------------------------------------------------
// Configuration could be done with TypeScript too
// https://webpack.js.org/configuration/configuration-languages/
// Here I'll use JavaScript, as I didn't know / think about using TS therefore.
// Also almost all config-documentation and examples are bases on JS, so I'll
// stick to JS here.
