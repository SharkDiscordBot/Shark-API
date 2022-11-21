import 'module-alias/register';
import { Logger } from '@/modules/logger';
import * as config from '@configs/config.json';
import * as mongodb from '@/modules/connect_mongodb';
import * as express from 'express';
import * as log4js from 'log4js';
import * as bodyParser from 'body-parser';
import api_v1 from '@/routes/v1';
import * as Error from '@/modules/errorException';
import * as exec from 'child_process';
import * as mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';

// DB_Model
import SystemModel from '@/schema/system';
//end

Logger.SystemInfo("しゃーくBot Backend Server");

// mongoDBに接続
mongodb.connect_mongodb();

// APIの起動

let app = express();

app.listen(config.server.port, function() {
  Logger.SystemInfo("webサーバーを起動しました");
});

// APIサーバーの設定

// logger
const app_logger = log4js.getLogger("access")
app.use(log4js.connectLogger(app_logger, {level: 'auto'}));

//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// NoSQL injectionの対策
app.use(mongoSanitize());
// Or, to replace these prohibited characters with _, use:
app.use(
  mongoSanitize({
    replaceWith: '_',
  }),
);

// Or, to sanitize data that only contains $, without .(dot)
// Can be useful for letting data pass that is meant for querying nested documents.
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
    replaceWith: '_',
  }),
);

// HTTPヘッダーの設定
app.use(helmet());

// TODO: xss対策


// route
app.use("/v1", api_v1);

app.use(function(req, res, next) {
  Error.HttpException.NotFound(res);
});


async function SystemData_DB_write() {
  let system_data = await SystemModel.findOne({_id: "system_data"});
  // commit hashなどを取得
  let hash_cmd = exec.execSync("git show --format='%H' --no-patch");
  let local_branch_cmd = exec.execSync("git rev-parse --abbrev-ref HEAD");
  
  // Stringにし改行コードを削除
  let hash = hash_cmd.toString();
  hash = hash.replace(/\r?\n/g, '');

  let local_branch = local_branch_cmd.toString();
  local_branch = local_branch.replace(/\r?\n/g, '');

  if(!system_data){
    let write_data = await SystemModel.create({
      _id: "system_data",
      commit_hash: hash,
      local_branch: local_branch
    });

    write_data.save().catch((err: any) => {
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
export default app;