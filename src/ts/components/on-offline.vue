<template>
    <!-- :class would do the job, but then there is a warning about duplicate class attribute -->
    <!-- hence the full syntax is used here. -->
    <div class="fixed-bottom on-offline" v-bind:class="{ 'on-offline-online': isOnline, 'on-offline-offline': !isOnline }">
        <div v-if="isOnline">online</div>
        <div v-else>offline</div>
    </div>
</template>

<style lang="less" scoped>
    .on-offline {
        margin-bottom: 1em;
        text-align   : center;
        font-size    : x-small;
    }

    .on-offline-online {
        background-color: #00ff21;
    }

    .on-offline-offline {
        background-color: #fe3f3f;
    }
</style>

<script lang="ts">
    import { Vue, Component } from "vue-property-decorator";
    //-------------------------------------------------------------------------
    @Component
    export default class OnOffline extends Vue {
        public isOnline: boolean = true;
        //---------------------------------------------------------------------
        // Here it's better to use the ctor, as the effect is immediately.
        // When using `mount` in the tests `await sut.vm.$nextTick();` has to
        // be used, to wait for the VDom to materialize.
        constructor() {
            super();

            if (window) {
                this.isOnline = navigator.onLine;

                // Have explicit method to handle the event
                // * allows de-registering the event
                // * is guaranteed that `this` point to what it is intended
                //   (an lambda would have different this in tests that use artificial DOM (jest))
                window.addEventListener("online" , this.onOnline);
                window.addEventListener("offline", this.onOffline);
            }
        }
        //---------------------------------------------------------------------
        private onOnline(): void {
            this.isOnline = true;
            console.debug("went online");
        }
        //---------------------------------------------------------------------
        private onOffline(): void {
            this.isOnline = false;
            console.debug("went offline");
        }
        //---------------------------------------------------------------------
        // De-register event-handler as good pratice to avoid memory leaks.
        private destroyed() {
            window.removeEventListener("online" , this.onOnline);
            window.removeEventListener("offline", this.onOffline);
        }
    }
</script>
