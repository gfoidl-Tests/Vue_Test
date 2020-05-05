const { CleanWebpackPlugin }     = require("clean-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const GitRevisionPlugin          = require("git-revision-webpack-plugin");
const HtmlWebpackPlugIn          = require("html-webpack-plugin");
const MiniCssExtractPlugIn       = require("mini-css-extract-plugin");
const OptimizeCssPlugIn          = require("optimize-css-assets-webpack-plugin");
const path                       = require("path");
const PreloadWebpackPlugin       = require("preload-webpack-plugin");
const svgToMiniDataUri           = require("mini-svg-data-uri");
const TerserPlugin               = require("terser-webpack-plugin");
const TsconfigPathsPlugin        = require("tsconfig-paths-webpack-plugin");
const VueLoaderPlugin            = require("vue-loader/lib/plugin");
const Webpack                    = require("webpack");

// https://github.com/webpack-contrib/webpack-bundle-analyzer
const BundleAnalyzerPlugIn = require("webpack-bundle-analyzer");
//-----------------------------------------------------------------------------
module.exports = (env, argv) => {
    const devMode = process.env !== "PRODUCTION" && argv.mode !== "production";

    if (devMode) {
        console.log("Development mode");
    } else {
        console.log("Production mode");
    }

    const tsConfigFile      = path.resolve(__dirname, "src", "tsconfig.json");
    const gitRevisionPlugin = new GitRevisionPlugin();

    const imgBaseOptions = {
        esModule  : false,                              // https://github.com/vuejs/vue-loader/issues/1612
        limit     : 8192,                               // bytes
        name      : devMode ? "[name].[ext]" : "[name].[hash].[ext]",
        outputPath: "images"
    };

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
            path      : path.resolve(__dirname, "dist", "assets"),
            // Don't make it relative to root (i.e. no leading /), so that it can be hosted everywhere (e.g. GH-pages)
            // Trailing / is mandatory, as the strings are just concatenated instead of handled properly :-(
            publicPath: "assets/",
            filename  : devMode ? "[name].js" : "[name].[hash].js"
        },
        module: {
            rules: [
                {
                    // If there is only one loader no use: [...] is needed
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
                    // Several loaders apply, they are processed from the end of the array
                    test: /\.(le|c)ss$/,
                    use : [
                        {
                            loader: MiniCssExtractPlugIn.loader,
                            options: {
                                esModule  : true,       // enables e.g. tree-shaking
                                hmr       : devMode,
                                publicPath: "./"        // CSS-path are relative to the CSS-file location
                            }
                        },
                        "css-loader",
                        {
                            loader : "less-loader",
                            options: {
                                lessOptions: {
                                    strictMath: true    // needed for Bootstrap: https://github.com/twbs/bootstrap/issues/28419
                                }
                            }
                        }
                    ]
                },
                {
                    test: /\.(png|jpg|gif)$/i,
                    loader : "url-loader",
                    options: imgBaseOptions
                },
                {
                    test   : /\.svg$/i,
                    loader : "url-loader",
                    options: {
                        ...imgBaseOptions,
                        generator: content => svgToMiniDataUri(content.toString())
                    }
                }
            ]
        },
        plugins: [
            //gitRevisionPlugin,                        // uncomment to write VERSION and COMMITHASH files to output
            new Webpack.DefinePlugin({
                __DEBUG__     : JSON.stringify(devMode),
                VERSION       : JSON.stringify(gitRevisionPlugin.version()),
                BOOTSTRAP_SKIP: false
            }),
            new VueLoaderPlugin(),
            new ForkTsCheckerWebpackPlugin({
                tsconfig   : tsConfigFile,
                async      : false,
                memoryLimit: 4096,
                vue        : true
            }),
            new MiniCssExtractPlugIn({
                filename     : devMode ? "[name].css" : "[name].[hash].css",
                chunkFilename: devMode ? "[id].css"   : "[id].[hash].css"
            }),
            new HtmlWebpackPlugIn({
                template: "../index.html",
                filename: path.resolve(__dirname, "dist", "index.html")
            }),
            new PreloadWebpackPlugin({
                rel          : "preload",
                include      : "allAssets",
                fileWhitelist: [
                    /loading.*gif/,
                    /main.*.js$/
                ],
                as(entry) {
                    if (/\.gif$/.test(entry)) return "image";
                    return "script";
                }
            })
        ],
        optimization: {
            runtimeChunk: "single",
            splitChunks : {                             // https://webpack.js.org/plugins/split-chunks-plugin/
                chunks     : "all",                     // initial -> needed at entry instantly
                cacheGroups: {                          // async   -> async imports
                    app: {                              // all     -> all ;-)
                        name     : "app-common",
                        chunks   : "all",
                        minChunks: 2
                    },
                    common: {
                        test   : /[\\/]node_modules[\\/]/,
                        name   : "common",
                        chunks : "initial",             // with all everything will be included in index.html, so just the minimum to start
                        maxSize: !devMode ? 500000 : undefined  // dev-server doesn't like it
                    },
                    "async-common": {
                        test    : /[\\/]node_modules[\\/]/,
                        name    : "async-common",
                        chunks  : "async",              // with all everything will be included in index.html, so just the minimum to start
                        maxSize : !devMode ? 500000 : undefined, // dev-server doesn't like it
                        priority: -10
                    },
                    bootstrap: {
                        test  : /[\\/]node_modules[\\/](bootstrap|popper)/,
                        name  : "bootstrap",
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
            watchContentBase  : true,
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

    if (process.env.ANALYZE) {
        const analyzer = new BundleAnalyzerPlugIn.BundleAnalyzerPlugin();
        config.plugins.push(analyzer);
        console.log("added BundleAnalyzerPlugin");
    }

    return config;
};
//-----------------------------------------------------------------------------
// Configuration could be done with TypeScript too
// https://webpack.js.org/configuration/configuration-languages/
// Here I'll use JavaScript, as I didn't know / think about using TS therefore.
// Also almost all config-documentation and examples are bases on JS, so I'll
// stick to JS here.
