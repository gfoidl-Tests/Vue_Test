<template>
    <main-view></main-view>
</template>

<style lang="less" scoped>
</style>

<script lang="ts">
    import { Vue, Component } from "vue-property-decorator";

    import Loading      from "@cmp/loading.vue";
    import LoadingError from "@cmp/loading-error.vue";

    const MainView = () => ({
        // Webpack will prefetch this for us, so no need for /* webpackPreload: true */ 
        component: import(/* webpackChunkName: "main" */ "@view/main.vue") as any,     // https://github.com/vuejs/vue-class-component/issues/323#issuecomment-479834166
        loading  : Loading,
        error    : LoadingError,
        delay    : 0
    });
    //-------------------------------------------------------------------------
    @Component({
        components: {
            MainView
        }
    })
    export default class App extends Vue {
    }
</script>
