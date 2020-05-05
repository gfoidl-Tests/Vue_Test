<template>
    <!--<main-view></main-view>-->
    <loading></loading>
</template>

<style lang="less" scoped>
</style>

<script lang="ts">
    import { Vue, Component } from "vue-property-decorator";

    import Loading from "@cmp/loading.vue";
    //-------------------------------------------------------------------------
    @Component({
        components: {
            "MainView": () => import(/* webpackChunkName: "main" */ "@views/main.vue"),
            Loading
        }
    })
    export default class App extends Vue {
    }
</script>
