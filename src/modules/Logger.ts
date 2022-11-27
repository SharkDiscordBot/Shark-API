import config = require("@configs/config.json");
import * as log4js from "log4js";
log4js.configure({
  "appenders": {
    "system": { 
      "type": "dateFile",
      "filename": "logs/system.log" 
    },
    "access": { 
      "type": "dateFile",
      "filename": "logs/access.log" 
    },
    "error": { 
      "type": "dateFile",
      "filename": "logs/error.log" 
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

    if(config.settings.debug_logger == false){
      return;
    }
    
    const logger = log4js.getLogger("system");
    logger.debug(msg);
  }
}