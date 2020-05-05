import { shallowMount, Wrapper } from "@vue/test-utils";
import OnOffline                 from "@cmp/on-offline.vue";
//-----------------------------------------------------------------------------
describe("OnOffline.vue", () => {
    let sut: Wrapper<OnOffline>;
    //-------------------------------------------------------------------------
    afterEach(() => {
        jest.restoreAllMocks();

        if (sut) {
            sut.destroy();
        }
    });
    //-------------------------------------------------------------------------
    test("initial navigator is online -> online hint", () => {
        // navigator.onLine is a global readonly property, so mock it with spy
        jest.spyOn(navigator, "onLine", "get").mockReturnValue(true);

        // create sut here, so that mocked navigator is used
        sut = shallowMount(OnOffline)

            expect(sut.text()).toBe("online");
    });
    //-------------------------------------------------------------------------
    test("initial navigator is offline -> offline hint", () => {
        // navigator.onLine is a global readonly property, so mock it with spy
        jest.spyOn(navigator, "onLine", "get").mockReturnValue(false);

        // create sut here, so that mocked navigator is used
        sut = shallowMount(OnOffline)

        expect(sut.text()).toBe("offline");
    });
    //-------------------------------------------------------------------------
    test("going offline and online -> offline hint then online hint", async () => {
        jest.spyOn(navigator, "onLine", "get").mockReturnValueOnce(true);
        sut = shallowMount(OnOffline);
        
        window.dispatchEvent(new Event("offline"));
        await sut.vm.$nextTick();
        expect(sut.text()).toBe("offline");

        window.dispatchEvent(new Event("online"));
        await sut.vm.$nextTick();
        expect(sut.text()).toBe("online");
    });
});
