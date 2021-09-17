import path from 'path';
import puppeteer from 'puppeteer';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { Utils } from './utils';

export class Pptr {
    private logger = Utils.getLogger();
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
        
        try {
            await this.getData(userDataDir);
        } catch (error) {
            this.logger.error(error);
        }

        this.logger.info("close");
        // await browser.close();
    }

    async getData(path: string) {
        this.logger.info("path", path);
        const db = await open({
            filename: `${path}\\Default\\Cookies`,
            mode: sqlite3.OPEN_READONLY,
            driver: sqlite3.Database
        });
        const cookies = await db.all(`SELECT * FROM cookies 
        WHERE expires_utc = -1 OR expires_utc > ${Date.now() * 1000 + 11644473600000000}
        ORDER BY LENGTH(path) DESC, creation_utc ASC`);
        this.logger.info("SELECT");
        await db.close();
        this.logger.info('cookies', cookies);
        return cookies;
    }
}