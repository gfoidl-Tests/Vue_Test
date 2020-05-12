import * as fs           from "fs";
import * as path         from "path";
import { ElementHandle } from "puppeteer";
//-----------------------------------------------------------------------------
export default class Helper {
    static readonly s_screenShotDir = "screenshots";
    //-------------------------------------------------------------------------
    public static async takeScreenshot(name: string, outputDir?: string): Promise<void> {
        outputDir = outputDir ?? this.s_screenShotDir;

        Helper.ensureDirExists(outputDir);
        await page.screenshot({ path: path.resolve(outputDir, name) });
    }
    //-------------------------------------------------------------------------
    public static async isVisible(element: ElementHandle<Element>) {
        const boxModel = await element.boxModel();

        return boxModel?.width === 0
            && boxModel.height === 0;
    }
    //-------------------------------------------------------------------------
    public static sleep(ms: number): Promise<void> {
        return new Promise<void>(res => {
            setTimeout(() => res(), ms);
        });
    }
    //-------------------------------------------------------------------------
    private static ensureDirExists(outputDir: string): void {
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }
    }
}
