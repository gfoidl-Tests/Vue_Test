// Fake an external module. W/o this
// -> TS2669: Augmentations for the global scope can only be directly nested in external modules or ambient module declarations.
export { };
//-----------------------------------------------------------------------------
declare global {
    interface Window {
        __WB_MANIFEST: string[];
    }
}
