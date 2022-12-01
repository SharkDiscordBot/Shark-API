const fs = require("fs");
const log4js = require("log4js");

log4js.configure({
  "appenders": {
    "console": {
      "type": "console"
    }
  },
  "categories": {
    "default": { 
      "appenders": ["console"], 
      "level": "all" 
    },
  }
});

let logger = log4js.getLogger("system");

if(!fs.existsSync(__dirname + "/../configs/config.json")){
  logger.error("configファイルが存在しません");
  process.exit(1);
}

if(!fs.existsSync(__dirname + "/../dist/configs/config.json")){
  logger.warn("distファイルにconfigがありませんでした");
} else {
  fs.unlinkSync(__dirname + "/../dist/configs/config.json");
}