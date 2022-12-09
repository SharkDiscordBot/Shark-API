import "module-alias/register";
import { Logger } from "@/modules/Logger";
import * as config from "@configs/config.json";
import * as express from "express";
import * as log4js from "log4js";
import * as bodyParser from "body-parser";
import * as Error from "@/modules/ErrorException";
import * as exec from "child_process";
import * as mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import * as swaggerUi from "swagger-ui-express";
import * as YAML from "yamljs";
import { Utils } from "@/utils/Utils";
import * as system from "@root/system.json";
import { run_min } from "@/modules/CronSystem";
import * as cron from "node-cron"; 
import { ConfigUtils } from "@/utils/ConfigUtils";
import * as SystemUtil from "@/utils/System";
import * as https from "https";
import * as fs from "fs";
import * as crypto from "crypto";
import * as bcrypt from "bcrypt";

// DB_Model
import SystemModel from "@/schema/system";
import AuthModel from "@/schema/auth";
//end

// routes
import api_v1 from "@/routes/v1Router";
import licenses from "@/routes/licenses";
import login from "@/routes/login";
// end

Logger.SystemInfo("しゃーくBot API Server");

// configの値をチェック
ConfigUtils.check_config();

Utils.connect_mongodb();

// APIの起動

const app = express();

app.listen(config.server.port, function() {
  Logger.SystemInfo("webサーバーを起動しました");
});


// APIサーバーの設定

// logger
const app_logger = log4js.getLogger("access");
app.use(log4js.connectLogger(app_logger, {level: "auto"}));

//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 静的ファイル
app.use(express.static("views/public"));
app.set("view engine", "ejs");

// NoSQL injectionの対策
app.use(mongoSanitize());
// Or, to replace these prohibited characters with _, use:
app.use(
  mongoSanitize({
    replaceWith: "_",
  }),
);

// Or, to sanitize data that only contains $, without .(dot)
// Can be useful for constting data pass that is meant for querying nested documents.
// NOTE: This may cause some problems on older versions of MongoDb
// READ MORE: https://github.com/fiznool/express-mongo-sanitize/issues/36
app.use(
  mongoSanitize({
    allowDots: true,
  }),
);

// Both allowDots and replaceWith
app.use(
  mongoSanitize({
    allowDots: true,
    replaceWith: "_",
  }),
);

// HTTPヘッダーの設定
app.use(helmet());

// TODO: xss対策


if(config.maintenance_mode.enable != true){
// API docs
const swagger_config = YAML.load("swagger.yaml");

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swagger_config));
// route
app.use("/v1", api_v1);
app.use("/licenses", licenses);

app.post("/login", (req, res) => {
  login(req,res);
});

app.use(function(req, res) {
  Error.HttpException.NotFound(res);
});
} else {
  Logger.SystemWarn("メンテナンスモードが有効です");
  app.use(function(req, res) {
    const now_time = new Date().toLocaleString();
    const message = {"time": now_time, "status": "error", "http_status": config.maintenance_mode.res_status, "message": "Server Maintenance"};

    res.status(config.maintenance_mode.res_status);
    res.header("Content-Type", "application/json; charset=utf-8");
    res.send(message);
  });
}

// HTTPSサーバーを起動
if(config.server.ssl.enable == true) {
  const ssl_options = {
    key: fs.readFileSync(config.server.ssl.key_path),
    cert: fs.readFileSync(config.server.ssl.cert_path)
  };
  const SSLServer = https.createServer(ssl_options, app);
  SSLServer.listen(config.server.ssl.ssl_port, () => {
    Logger.SystemInfo("SSLサーバーが起動しました");
  });
}


async function SystemData_DB_write() {
  const system_data = await SystemModel.findOne({_id: "system_data"});
  // commit hashなどを取得
  const hash_cmd = exec.execSync("git show --format=%H --no-patch");
  const local_branch_cmd = exec.execSync("git rev-parse --abbrev-ref HEAD");
  
  // Stringにし改行コードを削除
  let hash = hash_cmd.toString();
  hash = hash.replace(/\r?\n/g, "");

  let local_branch = local_branch_cmd.toString();
  local_branch = local_branch.replace(/\r?\n/g, "");

  if(!system_data){
    const write_data = await SystemModel.create({
      _id: "system_data",
      commit_hash: hash,
      local_branch: local_branch
    });

    write_data.save().catch((err: string) => {
      Logger.SystemError(err);
      Logger.SystemError("DBの書き込みに失敗しました...");
      Logger.SystemError("書き込もうとしたデータ: システムデータ");
    });
  } else {
    await system_data.updateOne({
      commit_hash: hash,
      local_branch: local_branch
    });
  }
}

SystemData_DB_write();

// 初回更新
run_min.CheckStatus();

// cron system
cron.schedule("* * * * *", () => {
  run_min.CheckStatus();
});

// APIキーを発行
async function check_user() {
  const auth_user = await AuthModel.findOne({ _id: config.server.auth.auth_id});
  if(!auth_user) {
    const list = "1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";
    const key = await Array.from(crypto.randomFillSync(new Uint8Array(48))).map((n)=>list[n%list.length]).join("");
    const iv = await Array.from(crypto.randomFillSync(new Uint8Array(16))).map((n)=>list[n%list.length]).join("");

    const hash = await bcrypt.hashSync(key, 15);
    Logger.SystemInfo(key);
    const api_key_cipher = await crypto.createCipheriv("aes-256-cbc", config.server.auth.auth_key, iv);
    const api_key = await api_key_cipher.update(key , "utf-8", "hex") + api_key_cipher.final("hex");

    const write_data = await AuthModel.create({
      _id: config.server.auth.auth_id,
      api_key: hash,
      iv: iv
    });
    write_data.save()
    .catch((err) => {
      Logger.SystemError("DBの書き込みに失敗しました");
      Logger.SystemError("" + err);
    });

    // ログファイルに残したくないのでconsole.logで表示
    Logger.SystemInfo("APIキーはSharkBotなどでの設定などで必要です");
    console.log("APIキー: \n" + api_key);
    Logger.SystemInfo("上記の内容は再度表示されません。メモを行ってください。");
    
  }
  return "success";
}

check_user();

export default app;

// システムの詳細を表示
Logger.SystemInfo("======== しゃーくAPIServer ========");
Logger.SystemInfo("Version: " + system.version);
if(system.beta == true){
  Logger.SystemWarn("現在のバージョンはベータ版です");
} else {
  Logger.SystemInfo("現在のバージョンは安定版です");
}
Logger.SystemInfo("使用中のNodejsバージョン: " + process.version);
Logger.SystemInfo("使用中のOS: " + SystemUtil.Info.OS());
if(SystemUtil.Info.OS() == "windows"){
  Logger.SystemWarn("Windowsでの実行は推奨しません。詳細はドキュメントをご確認ください");
}
Logger.SystemInfo("=======================================");