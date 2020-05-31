import Vue          from "vue";
import App          from "@/app.vue";
import PwaRegistrar from "./pwa-registrar";
//-----------------------------------------------------------------------------
Vue.config.productionTip = false;
//-----------------------------------------------------------------------------
// If the app start, remove this old-browser-hint
const notSupportedBrowserInfo = document.getElementById("notSupportedBrowserInfo");
if (notSupportedBrowserInfo) {
    notSupportedBrowserInfo.remove();
    console.debug("notSupportedBrowserInfo removed from DOM");
}
//-----------------------------------------------------------------------------
// This would register all BootstrapVue components. It's huge.
// So in order to keep the initial chunk size down, the App component
// asynchronosly loads the MainView component, and this component registers
// BootstrapVue
//Vue.use(BootstrapVue);
//-----------------------------------------------------------------------------
// Needs the vue runtime compiler -- see webpack.config.js resolve.alias
// Otherwise: [Vue warn]: You are using the runtime-only build of Vue where the template compiler is not available. 
//const app = new Vue({
//    el        : "app",
//    components: {
//        "app": App
//    }
//});

// Here it uses a render function, so the runtime-only build can be used:
const app = new Vue({
    el    : "app",
    render: r => r(App)
});

// The same, but with explicit $mount instead of el. BTW: $mount has to be used for VueRouter
//const app = new Vue({
//    render: r => r(App)
//}).$mount("app");
//-----------------------------------------------------------------------------
PwaRegistrar.run();
