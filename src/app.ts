import 'module-alias/register';
import { Logger } from '@/modules/logger';
import * as config from '@configs/config.json';
import * as mongodb from '@/modules/connect_mongodb';
import * as express from 'express';
import * as log4js from 'log4js';
import * as bodyParser from 'body-parser';
import api_v1 from '@/routes/v1';
import * as Error from '@/modules/errorException';

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

// route
app.use("/v1", api_v1);

app.use(function(req, res, next) {
  Error.HttpException.NotFound(res);
});
export default app;