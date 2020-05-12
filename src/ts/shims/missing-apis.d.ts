// Fake an external module. W/o this
// -> TS2669: Augmentations for the global scope can only be directly nested in external modules or ambient module declarations.
export { };
//-----------------------------------------------------------------------------
declare global {
    // https://wicg.github.io/netinfo/
    //-------------------------------------------------------------------------
    interface WorkerNavigator {
        connection: NetworkInformation;
    }
    //-------------------------------------------------------------------------
    interface NetworkInformation {
        effectiveType: EffectiveConnectionType;
        type         : ConnectionType;
    }
    //-------------------------------------------------------------------------
    enum ConnectionType {
        "bluetooth",
        "cellular",
        "ethernet",
        "mixed",
        "none",
        "other",
        "unknown",
        "wifi",
        "wimax"
    };
    //-------------------------------------------------------------------------
    enum EffectiveConnectionType {
        "2g",
        "3g",
        "4g",
        "slow-2g"
    };
}
