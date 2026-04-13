import { describe, test, expect } from "vitest";
import { mount } from "@vue/test-utils";
import HelloWorld from "@/components/HelloWorld.vue";

describe("First test", () => {
    test("render ok", () => {
        const sut = mount(HelloWorld, { props: { msg: "Fut" } });

        expect(sut.text()).toContain("Fut");
    });
});
