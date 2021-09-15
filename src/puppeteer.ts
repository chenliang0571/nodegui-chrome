import path from 'path';
import puppeteer from 'puppeteer';

export class Pptr {
    async run() {
        const dir = process.env.PUPPETEER_EXECUTABLE_PATH ?  process.env.PUPPETEER_EXECUTABLE_PATH : '';
        const userDataDir = path.join(path.dirname(dir), '../userDataDir');
        const browser = await puppeteer.launch({
            headless: false,
            userDataDir,
        });
        const page = await browser.newPage();
        await page.goto('https://www.google.com');
        await page.screenshot({path: 'google.png'});
        
        await browser.close();
    }
}