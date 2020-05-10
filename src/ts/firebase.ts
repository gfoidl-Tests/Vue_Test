export interface FireBaseConfig {
    serverKey: string;
}
//-----------------------------------------------------------------------------
// Keys from https://web-push-codelab.glitch.me/
export const fireBaseConfig: FireBaseConfig = {
    serverKey: PUSH_MESSAGE_SERVER_KEY
};
//-----------------------------------------------------------------------------
// Bad implementation, but https://github.com/GoogleChromeLabs/web-push-codelab/blob/2cf0b715368fa5ec544784e3f3f3650f81cedb23/app/scripts/main.js#L31
export function urlB64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64  = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData     = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
}
