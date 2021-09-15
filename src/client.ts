import dotenv from "dotenv";
import fs from "fs";
import axios from 'axios';
import { FlexLayout, QFont, QGridLayout, QIcon, QLabel, QMainWindow, QPixmap, QPushButton, QSize, QWidget } from "@nodegui/nodegui";
import { Utils } from "./utils";
import douban from '../assets/douban.png';
import weibo from '../assets/weibo.png';
import { NwMenuBar } from "./ui-menu-bar";
import { Pptr } from "./puppeteer";

export class Client extends QMainWindow {
    private logger;
    constructor() {
        super();

        if (fs.existsSync('config/.env')) {
            dotenv.config({ path: 'config/.env' });
        } else {
            dotenv.config({ path: 'dist/config/.env' });
        }
        this.logger = Utils.getLog4js();
        this.logger.info('Client constructor: chrome executable =', process.env.PUPPETEER_EXECUTABLE_PATH);

        this.createGUI();
    }

    async getPixmap(url: string) {
        const { data } = await axios.get(url, { responseType: 'arraybuffer' });
        const pixmap = new QPixmap();
        pixmap.loadFromData(data);
        return pixmap;
    }

    createGUI() {
        this.setWindowTitle('robot');
        //this.resize(400, 200);
        // Root view
        const rootView = new QWidget();
        const rootViewLayout = new QGridLayout();
        rootView.setObjectName('rootView');
        rootView.setLayout(rootViewLayout);

        const ui = [{
            profile: 'r2d2',
            accounts: [{
                domain: 'm.weibo.cn',
                icon: new QIcon(weibo)
            }, {
                domain: 'm.douban.com',
                icon: new QIcon(douban)
            }]
        }, {
            profile: 'c3po',
            accounts: [{
                domain: 'm.weibo.cn',
                icon: new QIcon(weibo)
            }]
        }];
        this.setMenuBar(new NwMenuBar([
            {
                title: '用户配置',
                actions: [
                    { text: '新配置', signal: 'triggered', event: () => console.log("添加 clicked") },
                ]
            }, {
                title: 'r2d2',
                actions: [
                    { text: '重置', signal: 'triggered', event: () => console.log("重置 clicked") },
                    { text: '删除', signal: 'triggered', event: () => console.log("删除 clicked") }
                ]
            }, {
                title: 'c3po',
                actions: [
                    { text: '重置', signal: 'triggered', event: () => console.log("重置 clicked") },
                    { text: '删除', signal: 'triggered', event: () => console.log("删除 clicked") }
                ]
            }, {
                title: 'api',
                actions: [
                    {
                        text: 'chrome', signal: 'triggered', event: async () => {
                            const client = new Pptr();
                            try {
                                await client.run();
                            } catch (error) {
                                this.logger.error(error);
                            }
                            this.logger.info("chrome triggered");
                        }
                    },
                ]
            }]));

        for (let i = 0; i < ui.length; i++) {
            const profileHeader = new QWidget();
            const profileHeaderLayout = new FlexLayout();
            profileHeader.setObjectName('fieldset');
            profileHeader.setLayout(profileHeaderLayout);

            const title = new QLabel();
            title.setText(`用户配置${i + 1}`);
            title.setFont(new QFont("Microsoft Yahei", 14))
            profileHeaderLayout.addWidget(title);
            const name = new QLabel();
            name.setObjectName('profile-name-' + ui[i].profile);
            name.setText(ui[i].profile);
            name.setFont(new QFont("Microsoft Yahei", 32))
            name.setFixedSize(200, 100);
            profileHeaderLayout.addWidget(name);

            // label.setInlineStyle(`color: #eeeeee; background-color: #494949; font-size: large;`);
            rootViewLayout.addWidget(profileHeader, i, 0);
            for (let j = 0; j < ui[i].accounts.length; j++) {
                const button = new QPushButton();
                button.setObjectName(ui[i].accounts[j].domain);
                button.setEnabled(false);
                button.setIcon(ui[i].accounts[j].icon);
                button.setIconSize(new QSize(200, 200))
                // button.setFixedSize(200, 200);
                rootViewLayout.addWidget(button, i, j + 1);
            }
        }
        //添加新profile
        const button = new QPushButton();
        button.setText('添加新用户配置');
        rootViewLayout.addWidget(button, ui.length, 0);

        rootView.setStyleSheet(`
            #rootView {
                padding: 5px;
            }
            #fieldset {
                padding: 10px;
                border: 2px ridge #bdbdbd;
                margin-bottom: 4px;
            }
            `);
        this.setCentralWidget(rootView);
    }
}