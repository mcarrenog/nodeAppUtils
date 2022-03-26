import winston, {format} from "winston";
import {Format} from "logform";

class LoggerFactory {

    private readonly logger: winston.Logger;

    constructor() {
        this.logger = winston.createLogger({
            level: process.env.LOGGER_LEVEL || 'trace', //trace, debug, info, warn, error, fatal
            format: format.combine(
                winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss.SSS'}),
                this.logFormatCustom()
            ),
            levels: {
                fatal: 0,
                error: 1,
                warn: 2,
                info: 3,
                debug: 4,
                trace: 5
            },
            transports: [
                new winston.transports.Console()
            ],
        });
    }

    private logFormatCustom(): Format {
        return format.printf(
            info => {
                const infoFormat = {
                    trackId: `${info.timestamp}_${process.env.LOGGER_NAME_MS || 'ms-test'}`,
                    uniqueId: `${info.timestamp}_${process.env.LOGGER_NAME_MS || 'ms-test'}`,
                    time: info.timestamp,
                    level: this.getLevel(info.level),
                    system: 'DMR',
                    country: process.env.LOGGER_COUNTRY || 'CORP',
                    service: process.env.LOGGER_NAME_MS || 'ms-test',
                    environment: process.env.LOGGER_ENV || 'develop',
                    appVersion: process.env.npm_package_version || '0.0',
                    message: info.message
                }
                return JSON.stringify(infoFormat)
            }
        );
    }

    private getLevel(level: string): number {
        const levelMapping = new Map();
        levelMapping.set("info", 30);
        levelMapping.set("warn", 40);
        levelMapping.set("error", 50);
        levelMapping.set("fatal", 60);
        levelMapping.set("debug", 20);
        levelMapping.set("trace", 10);
        return levelMapping.get(level)
    }

    public getLogger() {
        return this.logger;
    }
}

export const loggerFactory = new LoggerFactory();