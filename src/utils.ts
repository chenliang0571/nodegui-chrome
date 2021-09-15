import log4js from "log4js";

export class Utils {
    static getLogger() {
        return log4js.getLogger();
    }
    static getLog4js() {
        const appender = ['default', 'local'].includes(process.env.LOG4JS_APPENDER + '')
            ? process.env.LOG4JS_APPENDER + '' : 'default';
        const level = ['info', 'debug'].includes(process.env.LOG4JS_LEVEL + '')
            ? process.env.LOG4JS_LEVEL + '' : 'info';
        log4js.configure({
            appenders: {
                default: { type: 'console' },
                local: { type: 'dateFile', filename: './logs/local.log', pattern: '.yyyy-MM-dd', backups: 7, compress: true }
            },
            categories: {
                default: { appenders: [appender], level }
            }
        });
        log4js.getLogger().info(`Client constructor: appender=${appender} level=${level}`);
        return log4js.getLogger();
    }
}