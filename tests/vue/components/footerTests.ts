import { shallowMount, Wrapper } from "@vue/test-utils";
import Footer                    from "@cmp/footer.vue";
//-----------------------------------------------------------------------------
describe("Footer.vue", () => {
    let sut: Wrapper<Footer>;
    //-------------------------------------------------------------------------
    beforeEach(() => {
        sut = shallowMount(Footer);
    });
    //-------------------------------------------------------------------------
    afterEach(() => {
        if (sut) {
            sut.destroy();
        }
    });
    //-------------------------------------------------------------------------
    test("correct year used", () => {
        const expected = new Date().getFullYear();

        const text  = sut.text();
        const match = /^© gfoidl,\s(\d+)/.exec(text);

        expect(match).not.toBeNull();

        const actual = parseInt(match![1]);

        expect(actual).toBe(expected);
    });
});
