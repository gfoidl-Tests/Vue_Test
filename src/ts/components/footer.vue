<template>
    <footer class="app-footer-copyright">
        © gfoidl, {{ year }}<br />
        commit: {{ version }}
    </footer>
</template>

<style lang="less">

    .app-footer-copyright {
        font-size: x-small;
        text-align: right;
    }
</style>

<script lang="ts">
    import { Vue, Component } from "vue-property-decorator";
    //-------------------------------------------------------------------------
    @Component
    export default class Footer extends Vue {
        public year: number;
        public version = VERSION;   // defined by webpack
        //---------------------------------------------------------------------
        constructor() {
            super();
            this.year = new Date().getFullYear();
        }
    }
</script>
