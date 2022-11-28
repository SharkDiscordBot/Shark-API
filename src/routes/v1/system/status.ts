//import * as config from "@configs/config.json";
import * as express from "express";
import * as Error from "@/modules/ErrorException";
import * as system_version from "@root/system.json";
import { Utils } from "@/modules/Utils";
import StatusModel from "@/schema/status";
import { Logger } from "@/modules/Logger";

// add router
const router = express.Router();

async function send_status(res: express.Response){
  const bot_status = await StatusModel.findOne({ _id: "bot" });
  const frontend_status = await StatusModel.findOne({ _id: "frontend" });
  
  if(!bot_status){
    Error.HttpException.InternalServerError(res);
    Logger.SystemError("Error: ステータスデータの参照に失敗しました");
    return;
  }

  if(!frontend_status){
    Error.HttpException.InternalServerError(res);
    Logger.SystemError("Error: ステータスデータの参照に失敗しました");
    return;
  }

  await res.status(200);
  await res.header("Content-Type", "application/json; charset=utf-8");
  const now_time = new Date().toLocaleString();
  // TODO: statusのwarnなどの切り替え定義を決める
  
  const ping = Utils.ping("8.8.8.8");
  const api_status_message = {"version": system_version.version, "status": "up", "ping": ping};
  const bot_status_message = {"version": bot_status.version, "status": bot_status.status, "ping": bot_status.ping};
  const frontend_status_message = {"version": frontend_status.version, "status": frontend_status.status, "ping": frontend_status.ping};
  const message = {"api_status": api_status_message, "bot_status": bot_status_message, "frontend_status": frontend_status_message, "time": now_time, "status": "success", "http_status": 200, "message": "none"};
  await res.send(message);
}

router.get("/", (req, res)  => {
  send_status(res);
});

router.post("/", (req, res)  => {
  Error.HttpException.BadRequest(res);
});

export default router;