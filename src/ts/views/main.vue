<template>
    <b-container>
        <b-row>
            <b-col>
                <b-img right src="@img/calculator.png" class="img-logo" height="64px"></b-img>
                <h2>Calculator</h2> <!-- must come after img due to float -->
            </b-col>
        </b-row>
        <hr />
        <b-row>
            <b-col>
                <b-form @submit.prevent="calculate" @reset.prevent="reset">
                    <b-form-group id="grpA" label="First argument" label-for="input-a">
                        <b-form-input id="input-a" v-model.number="input.a" type="number" required placeholder="first argument"></b-form-input>
                    </b-form-group>

                    <b-form-group id="grpB" label="Second argument" label-for="input-b">
                        <b-form-input id="input-b" v-model.number="input.b" type="number" required placeholder="second argument"></b-form-input>
                    </b-form-group>

                    <b-form-group id="grpOp" label="Operation" label-for="input-op">
                        <b-form-select id="input-op" v-model="input.operation" :options="operations" required></b-form-select>
                    </b-form-group>

                    <b-button id="calcButton" type="submit" variant="primary" :disabled="!canCalc">Calculate</b-button>
                    <b-button id="resetButton" type="reset" variant="danger">Reset</b-button>
                </b-form>

                <hr />

                <b-row>
                    <b-col id="resultCol">
                        <div v-if="result !== null" id="resultDiv">
                            Result: <strong class="result">{{ result }}</strong>
                        </div>
                        <div v-if="message.length > 0" id="messageDiv">
                            <strong class="message">{{ message }}</strong>
                        </div>
                    </b-col>

                    <b-col>
                        <foot-notes></foot-notes>
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
        <on-offline></on-offline>
    </b-container>
</template>

<style lang="less" scoped>
    h2 {
        margin: 0.5em 0;
    }

    /*
        Could be done with Vue too. But Vue is for the logic and not for the cosmetic, as here.
        In Vue the result and message is set, because their visibility depends on the logic.
        Hence this case here should be handled by CSS.
    */
    @media (max-width: 250px) {
        .img-logo {
            display: none !important;
        }
    }

    .result {
        color: #0094ff;
    }

    .message {
        color: #fe4444;
    }
</style>

<script lang="ts">
    import { Vue, Component } from "vue-property-decorator";
    import setupBootstrap     from "@/setup-bootstrap";
    import { Input }          from "./input";
    import * as calc          from "@svc/calculator";
    import * as idb           from "idb-keyval";

    import Footer    from "@cmp/footer.vue";
    import OnOffline from "@cmp/on-offline.vue";
    //-------------------------------------------------------------------------
    // Fabalouse hack for testing with jest, otherwise there are some build
    // failures which seem strange to me...
    if (__RUN_FROM_TEST__ === undefined || !__RUN_FROM_TEST__) {
        setupBootstrap();
    } else {
        console.debug("Skipping registration of BootstrapVue PlugIn");
    }
    //-------------------------------------------------------------------------
    @Component({
        components: {
            "FootNotes": Footer,
            OnOffline
        }
    })
    export default class MainView extends Vue {
        private operation: calc.Operation;
        private store    : idb.Store | null;
        //---------------------------------------------------------------------
        public input     : Input;
        public result    : calc.NullableNumber = null;
        public message = "";
        public operations: string[] = [];
        //---------------------------------------------------------------------
        constructor() {
            super();

            // https://riptutorial.com/typescript/example/17503/how-to-get-all-enum-values
            for (let value in calc.Operation) {
                if (typeof calc.Operation[value] === "number") {
                    this.operations.push(value);
                }
            }

            this.input = {
                a        : null,
                b        : null,
                operation: calc.Operation[calc.Operation.Add]
            };

            this.operation = calc.toOperation(this.input.operation);

            if ("indexedDB" in window) {
                const db    = "calc";
                const store = "input";
                this.store  = new idb.Store("calc", "input");
                console.debug(`IndexedDB store-object with db ${db} and store ${store} created`);
            } else {
                this.store = null;
                console.debug("This browser doesn't support IndexedDB");
            }
        }
        //---------------------------------------------------------------------
        private async mounted(): Promise<void> {
            if (this.store) {
                const storedInput = await idb.get<Input>("calc", this.store);

                if (storedInput) {
                    this.input = storedInput;
                    console.debug("loaded stored calc from IndexedDB");
                }
            }
        }
        //---------------------------------------------------------------------
        public async calculate(): Promise<void> {
            this.operation = calc.toOperation(this.input.operation);

            //console.log(JSON.stringify(this.input));

            if (this.store) {
                await idb.set("calc", this.input, this.store);
                console.debug("stored current calc to IndexedDB");
            }

            try {
                this.result  = calc.Calculator.calculate(this.operation, this.input.a, this.input.b);
                this.message = "";

                //console.log(`result: ${this.result}`);
            } catch (e) {
                this.result  = null;
                this.message = e.message;

                //console.error("error: ", e);
            }
        }
        //---------------------------------------------------------------------
        public async reset(): Promise<void> {
            this.input = {
                a        : null,
                b        : null,
                operation: calc.Operation[calc.Operation.Add]
            };

            this.result  = null;
            this.message = "";

            if (this.store) {
                await idb.del("calc", this.store);
            }
        }
        //---------------------------------------------------------------------
        get canCalc(): boolean {
            return this.isValidNumber(this.input.a)
                && this.isValidNumber(this.input.b);
        }
        //---------------------------------------------------------------------
        private isValidNumber(val: calc.NullableNumber): boolean {
            // an empty number is of type string due the binding with .number
            // above in the template

            return typeof val === "number"
                && val !== null;
        }
    }
</script>
