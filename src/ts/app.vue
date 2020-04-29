<template>
    <div class="greeting">
        Hello {{ name }}!
    </div>
</template>

<style lang="less" scoped>
    .greeting {
        font-weight: bold;
        text-align: center;
        background-color: #d19191;
    }
</style>

<script lang="ts">
    import { Vue, Component } from "vue-property-decorator";
    //-------------------------------------------------------------------------
    @Component
    export default class App extends Vue {
        public name: string = "world";
        //---------------------------------------------------------------------
        private mounted(): void {
            console.log("App mounted");
        }
    }
</script>
