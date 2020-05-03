import * as fs           from "fs";
import * as path         from "path";
import { ElementHandle } from "puppeteer";
//-----------------------------------------------------------------------------
export default class Helper {
    static readonly s_screenShotDir = "screenshots";
    //-------------------------------------------------------------------------
    public static async takeScreenshot(name: string): Promise<void> {
        Helper.ensureDirExists();
        await page.screenshot({ path: path.resolve(Helper.s_screenShotDir, name) });
    }
    //-------------------------------------------------------------------------
    public static async isVisible(element: ElementHandle<Element>) {
        const boxModel = await element.boxModel();

        return boxModel?.width === 0
            && boxModel.height === 0;
    }
    //-------------------------------------------------------------------------
    private static ensureDirExists(): void {
        if (!fs.existsSync(Helper.s_screenShotDir)) {
            fs.mkdirSync(Helper.s_screenShotDir);
        }
    }
}
