import { shallowMount } from "@vue/test-utils";
import Footer           from "@cmp/footer.vue";
//-----------------------------------------------------------------------------
describe("Footer.vue", () => {
    test("correct year used", () => {
        const wrapper  = shallowMount(Footer);
        const expected = new Date().getFullYear();

        const text  = wrapper.text();
        const match = /© gfoidl,\s(\d+)/.exec(text);

        expect(match).not.toBeNull();

        const actual = parseInt(match![1]);

        expect(actual).toBe(expected);
    });
});
