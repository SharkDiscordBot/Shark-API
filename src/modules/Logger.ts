import config = require("@configs/config.json");
import * as log4js from "log4js";

log4js.configure({
  "appenders": {
    "system": {
      "type": "dateFile",
      "filename": "logs/system.log",
      "pattern": "yyyy-MM-dd",
      "compress": true,
      "filesToKeep": 4
    },
    "access": {
      "type": "dateFile",
      "filename": "logs/access.log",
      "pattern": "yyyy-MM-dd",
      "compress": true,
      "filesToKeep": 4
    },
    "error": {
      "type": "dateFile",
      "filename": "logs/error.log",
      "pattern": "yyyy-MM-dd",
      "compress": true,
      "filesToKeep": 4
    },
    "debug": {
      "type": "dateFile",
      "filename": "logs/debug.log",
      "pattern": "yyyy-MM-dd",
      "compress": true,
      "filesToKeep": 4
    },
    "console": {
      "type": "console"
    }
  },
  "categories": {
    "default": {
      "appenders": ["access", "console"],
      "level": "all"
    },
    "access": {
      "appenders": ["access", "console"],
      "level": "all"
    },
    "system": {
      "appenders": ["system", "console"],
      "level": "all"
    },
    "error": {
      "appenders": ["error", "console", "system"],
      "level": "WARN"
    },
    "console_debug": {
      "appenders": ["debug", "console"],
      "level": "all"
    },
    "debug": {
      "appenders": ["debug"],
      "level": "all"
    }
  }
});


export class Logger{

  public static SystemInfo(msg: string): void {
    const logger = log4js.getLogger("system");
    logger.info(msg);
  }

  public static SystemWarn(msg: string): void {
    const logger = log4js.getLogger("system");
    logger.warn(msg);
  }

  public static SystemError(msg: string): void {
    const logger = log4js.getLogger("error");
    logger.error(msg);
  }

  public static AccessInfo(msg: string): void {
    const logger = log4js.getLogger("access");
    logger.info(msg);
  }

  public static AccessWarn(msg: string): void {
    const logger = log4js.getLogger("access");
    logger.warn(msg);
  }

  // 404エラーなどで使用することを想定, システムの処理エラーなどはSystemErrorを使う
  public static AccessError(msg: string): void {
    const logger = log4js.getLogger("access");
    logger.error(msg);
  }

  // debugLogger
  public static Debug(msg: string): void {

    let logger;
    if(config.settings.debug_logger == false){
      logger = log4js.getLogger("debug");
      logger.debug(msg);
    } else {
      logger = log4js.getLogger("console_debug");
      logger.debug(msg);
    }
  }
}