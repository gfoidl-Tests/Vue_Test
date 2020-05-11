import * as fs                 from "fs";
import * as path               from "path";
import { ElementHandle, Page } from "puppeteer";
//-----------------------------------------------------------------------------
export default class Helper {
    static readonly s_screenShotDir = "screenshots";
    //-------------------------------------------------------------------------
    public static async takeScreenshot(name: string, pageForScreenshot: Page = page): Promise<void> {
        Helper.ensureDirExists();
        await pageForScreenshot.screenshot({ path: path.resolve(Helper.s_screenShotDir, name) });
    }
    //-------------------------------------------------------------------------
    public static async isVisible(element: ElementHandle<Element>) {
        const boxModel = await element.boxModel();

        return boxModel?.width === 0
            && boxModel.height === 0;
    }
    //-------------------------------------------------------------------------
    public static async checkCountOfInputStore(pageToEvaluate: Page): Promise<number> {
        return pageToEvaluate.evaluate(() => {
            return new Promise((resolve, reject) => {
                const openRequest = window.indexedDB.open("calc");

                // Note: not => as this would capture this
                openRequest.onsuccess = function () {
                    const db            = this.result;
                    const transaction   = db.transaction("input", "readonly");
                    transaction.onerror = function () { reject(this.error); }

                    const store            = transaction.objectStore("input");
                    const countRequest     = store.count();
                    countRequest.onsuccess = function () {
                        const count = this.result;
                        resolve(count);
                    }
                }

                openRequest.onerror = function () {
                    console.error("error opening db", this.error);
                    reject(this.error);
                }
            });
        }) as Promise<number>;
    }
    //-------------------------------------------------------------------------
    public static sleep(ms: number): Promise<void> {
        return new Promise<void>(res => {
            setTimeout(() => res(), ms);
        });
    }
    //-------------------------------------------------------------------------
    private static ensureDirExists(): void {
        if (!fs.existsSync(Helper.s_screenShotDir)) {
            fs.mkdirSync(Helper.s_screenShotDir);
        }
    }
}
