import { mount, createLocalVue, Wrapper } from "@vue/test-utils";
import BootstrapVue                       from "bootstrap-vue";
import MainView                           from "@view/main.vue";
//-----------------------------------------------------------------------------
describe("App.vue", () => {
    let sut: Wrapper<MainView>;
    //-------------------------------------------------------------------------
    beforeEach(() => {
        const localVue = createLocalVue();
        localVue.use(BootstrapVue);

        sut = mount(MainView, { localVue });
    });
    //-------------------------------------------------------------------------
    afterEach(() => {
        if (sut) {
            sut.destroy();
        }
    });
    //-------------------------------------------------------------------------
    test("test wrapper created -> correct name", () => {
        expect(sut.name()).toBe("MainView");
    });
    //-------------------------------------------------------------------------
    test("no inputs -> calcButton disabled and resultCol not visible", () => {
        // get is similar to find, expect it throws an error if nothing is found.

        const calcButton = sut.get("#calcButton");
        const resultCol  = sut.get("#resultCol");

        expect(calcButton.attributes("disabled")).toBe("disabled");
        expect(resultCol.text().length).toBe(0);
    })
    //-------------------------------------------------------------------------
    test("correct options set", () => {
        const select = sut.get("#input-op");

        expect(select.html()).toMatchSnapshot();
    });
    //-------------------------------------------------------------------------
    // Skipping this test, as -- for me -- it's bad pratice to test via
    // VM - properties. Only the "public interface" (i.e. inputs, buttons, etc.)
    // should be tested. So that the correctness of the bindings in the
    // template can be validated.
    // Whether the property is named `a` or whatever should be considered as
    // implementation detail.
    test.skip("inputs via vm-properties -> calcButton enabled", async () => {
        sut.vm.$data.input.a = 3;
        sut.vm.$data.input.b = 4;

        await sut.vm.$nextTick();

        const calcButton = sut.get("#calcButton");
        const actual     = calcButton.attributes("disabled");

        expect(actual).toBeUndefined();
    })
    //-------------------------------------------------------------------------
    test("inputs via DOM -> calcButton enabled", async () => {
        const inputA     = sut.get("#input-a");
        const inputB     = sut.get("#input-b");
        const calcButton = sut.get("#calcButton");

        inputA.setValue(3);
        inputB.setValue(4);

        await sut.vm.$nextTick();
        const actual = calcButton.attributes("disabled");

        expect(actual).toBeUndefined();
    });
    //-------------------------------------------------------------------------
    test("inputs, then one erased -> calcButton disabled", async () => {
        const inputA     = sut.get("#input-a");
        const inputB     = sut.get("#input-b");
        const calcButton = sut.get("#calcButton");

        inputA.setValue(3);
        inputB.setValue(4);

        await sut.vm.$nextTick();
        let actual = calcButton.attributes("disabled");
        expect(actual).toBeUndefined();

        inputB.setValue("");
        await sut.vm.$nextTick();
        actual = calcButton.attributes("disabled");
        expect(actual).toBe("disabled");

        inputB.setValue(null);
        await sut.vm.$nextTick();
        actual = calcButton.attributes("disabled");
        expect(actual).toBe("disabled");

        inputB.setValue(undefined);
        await sut.vm.$nextTick();
        actual = calcButton.attributes("disabled");
        expect(actual).toBe("disabled");
    });
    //-------------------------------------------------------------------------
    test("inputs, operation -> resultDiv shows correct result, messageDiv not", async () => {
        sut.get("#input-a") .setValue(22);
        sut.get("#input-b") .setValue(7);
        sut.get("#input-op").findAll("option").at(1).setSelected();    // Subtract

        // Wait for the view to update (especially due the selected option)
        await sut.vm.$nextTick();

        await sut.get("form").trigger("submit");

        const resultDiv  = sut.find("#resultDiv");
        const messageDiv = sut.find("#messageDiv");

        expect(resultDiv .exists()) .toBe(true);
        expect(messageDiv.exists()).toBe(false);

        const result = (/^Result:\s(\d+)$/.exec(resultDiv.text()))![1];
        expect(result).toBe("15");
    });
    //-------------------------------------------------------------------------
    test("failure in calc -> message displayed", async () => {
        sut.get("#input-a") .setValue(1);
        sut.get("#input-b") .setValue(0);
        sut.get("#input-op").findAll("option").at(3).setSelected();    // Divide

        await sut.vm.$nextTick();
        await sut.get("form").trigger("submit");

        const resultDiv  = sut.find("#resultDiv");
        const messageDiv = sut.find("#messageDiv");

        expect(resultDiv .exists()).toBe(false);
        expect(messageDiv.exists()).toBe(true);

        expect(messageDiv.text()).toBe("Divisor must not be 0.");
    });
    //-------------------------------------------------------------------------
    test("reset clicked -> inputs are cleared", async () => {
        const inputA     = sut.get("#input-a");
        const inputB     = sut.get("#input-b");
        const calcButton = sut.get("#calcButton");

        inputA.setValue(3);
        inputB.setValue(4);
        await sut.vm.$nextTick();

        let buttonState = calcButton.attributes("disabled");
        expect(buttonState).toBeUndefined();

        await sut.get("form").trigger("reset");

        expect(inputA.text().length).toBe(0);
        expect(inputB.text().length).toBe(0);

        const select = sut.get("#input-op").element as HTMLSelectElement;
        expect(select.value).toBe("Add");

        buttonState = calcButton.attributes("disabled");
        expect(buttonState).toBe("disabled");
    });
});
