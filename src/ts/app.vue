<template>
    <main-view></main-view>
</template>

<style lang="less" scoped>
</style>

<script lang="ts">
    import { Vue, Component } from "vue-property-decorator";
    //-------------------------------------------------------------------------
    @Component({
        components: {
            "MainView": () => import(/* webpackChunkName: "main" */ "@views/main.vue")
        }
    })
    export default class App extends Vue {
    }
</script>
