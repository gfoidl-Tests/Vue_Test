const { CleanWebpackPlugin }     = require("clean-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const GitRevisionPlugin          = require("git-revision-webpack-plugin");
const HtmlWebpackPlugin          = require("html-webpack-plugin");
const MiniCssExtractPlugin       = require("mini-css-extract-plugin");
const OptimizeCssPlugin          = require("optimize-css-assets-webpack-plugin");
const path                       = require("path");
const PreloadWebpackPlugin       = require("preload-webpack-plugin");
const svgToMiniDataUri           = require("mini-svg-data-uri");
const TerserPlugin               = require("terser-webpack-plugin");
const TsconfigPathsPlugin        = require("tsconfig-paths-webpack-plugin");
const VueLoaderPlugin            = require("vue-loader/lib/plugin");
const Webpack                    = require("webpack");
const WebpackPwaManifest         = require("webpack-pwa-manifest");
const WorkboxPlugin              = require("workbox-webpack-plugin");

// https://github.com/webpack-contrib/webpack-bundle-analyzer
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer");
//-----------------------------------------------------------------------------
module.exports = (env, argv) => {
    const devMode = process.env !== "PRODUCTION" && argv.mode !== "production";

    if (devMode) {
        console.log("Development mode");
    } else {
        console.log("Production mode");
    }

    const tsConfigFile      = path.resolve(__dirname, "src", "ts", "tsconfig.json");
    const gitRevisionPlugin = new GitRevisionPlugin();

    const imgBaseOptions = {
        esModule  : false,                              // https://github.com/vuejs/vue-loader/issues/1612
        limit     : 8192,                               // bytes
        name      : devMode ? "[name].[ext]" : "[name].[hash:8].[ext]",
        outputPath: "images"
    };

    const config = {
        mode   : devMode ? "development" : "production",
        context: path.resolve(__dirname, "src", "ts"),  // resolve vs. join -> https://stackoverflow.com/a/39836259/347870
        entry  : {
            app         : "./app",
            checkBrowser: "./checkBrowser"
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
            filename  : devMode ? "[name].js" : "[name].[contenthash:8].js"
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
                            loader: MiniCssExtractPlugin.loader,
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
                __DEBUG__        : JSON.stringify(devMode),
                __VERSION__      : JSON.stringify(gitRevisionPlugin.version()),
                __RUN_FROM_TEST__: false
            }),
            new Webpack.HashedModuleIdsPlugin(),
            new VueLoaderPlugin(),
            new ForkTsCheckerWebpackPlugin({
                async     : false,
                typescript: {
                    configFile : tsConfigFile,
                    memoryLimit: 4096,
                    extensions : {
                        vue: true
                    }
                },
            }),
            new MiniCssExtractPlugin({
                filename     : devMode ? "[name].css" : "[name].[contenthash:8].css",
                chunkFilename: devMode ? "[id].css"   : "[id].[contenthash:8].css"
            }),
            new HtmlWebpackPlugin({
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
            }),
            new WebpackPwaManifest({
                filename        : "../manifest.[hash:8].json",
                name            : "Vue Test",
                fingerprints    : !devMode,
                publicPath      : "",                   // leave start_url out, to use default which serves from page-root by .
                descriptions    : "Playground for Vue's setup with test-frameworks",
                theme_color     : "#007bff",
                background_color: "#ffffff",
                icons           : [
                    {
                        src        : path.resolve(__dirname, "src", "images", "calculator.png"),
                        sizes      : [96, 128, 192, 256, 384, 512],
                        destination: "icons"
                    }
                ],
                ios      : true,
                shortcuts: [
                    {
                        name: "Start",
                        url : "/?utm_source=homescreen"
                    }
                ]
            })
            // workbox doesn't play nice with watch-mode, so inject these plugins separate (see below)
            // See also https://github.com/GoogleChrome/workbox/issues/1790
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
                new OptimizeCssPlugin({})
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

    // Due workbox not playing nice with watch-mode, inject these plugins here
    // when not in watch-mode (also see comment above in the plugins).
    if (!argv.watch && !runsInDevServer) {
        const workboxPlugin =
            //new WorkboxPlugin.GenerateSW({
            //    swDest                       : "../sw.js",  // for the scope of the site, this should be at the root
            //    clientsClaim                 : true,
            //    skipWaiting                  : true,
            //    cleanupOutdatedCaches        : true,
            //    maximumFileSizeToCacheInBytes: 4 * 1024 * 1024
            //});
            // This plugin injects the workbox code into a template given by `swSrc`.
            // More setup cost, but more possibilities.
            // With GenerateSW the file given with `swSrc` isn't needed. All is done by workbox.
            new WorkboxPlugin.InjectManifest({
                swSrc                        : path.resolve(__dirname, "src", "ts", "service-worker.ts"),
                swDest                       : "../sw.js",  // for the scope of the site, this should be at the root
                maximumFileSizeToCacheInBytes: 4 * 1024 * 1024
            });

        config.plugins.push(workboxPlugin);
    }

    if (process.env.ANALYZE) {
        const analyzer = new BundleAnalyzerPlugin.BundleAnalyzerPlugin();
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
