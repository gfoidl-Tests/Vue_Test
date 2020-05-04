import Vue            from "vue";
import App            from "@/app.vue";
import setupBootstrap from "./setup-bootstrap";
//-----------------------------------------------------------------------------
Vue.config.productionTip = false;
setupBootstrap();

// To keep the size small, the individual components are imported instead the
// global registration of all -- which is useful if quite a lot get used...
//Vue.use(BootstrapVue);

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
