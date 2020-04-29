import Vue          from "vue";
import BootstrapVue from "bootstrap-vue";

import App from "@/app.vue";

import "bootstrap-vue/dist/bootstrap-vue.css";
//-----------------------------------------------------------------------------
Vue.use(BootstrapVue);

const app = new Vue({
    el        : "app",
    components: {
        "app": App
    }
});
