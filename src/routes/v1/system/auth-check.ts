//import { Logger } from "@/modules/logger";
//import * as config from "@configs/config.json";
import * as express from "express";
import * as Error from "@/modules/ErrorException";
import { Utils } from "@/utils/Utils";
import { Logger } from "@/modules/Logger";

export default async function(req: express.Request, res: express.Response) {
  const now_time = new Date().toLocaleString();

  if(!req.headers.authorization) {
    Error.HttpException.BadRequest(res);
    return;
  }

  try {
    const token = Utils.decode_jwt_token(req.headers.authorization);
    const left = token.exp - new Date().getTime() /1000;

    if(token.exp < new Date().getTime() /1000) {
      // token失効済み
      Logger.SystemInfo("セッションID: " + token.id + " は失効済みです");
      Logger.Debug("EXP: " + token.exp + " now_time: " + new Date().getTime() /1000 + " left: " + left);
      const ng_msg = {"token": "ng", "time": now_time, "http_status": 200, "status": "success", "message": "このJWTトークンは失効しています"};
      res.status(200);
      res.send(ng_msg);
      return;
    }

    if(left <= 60 && left >= 0){
      // token失効1分前

      Logger.SystemInfo("セッションID: " + token.id + " はまもなく失効します");
      const warn_msg = {"token": "warn", "time": now_time, "http_status": 200, "status": "success", "message": "このJWTトークンは1分以内に失効します"};
      res.status(200);
      res.send(warn_msg);
      return;
    }

    const ok_msg = {"token": "ok", "time": now_time, "http_status": 200, "status": "success", "message": "このJWTトークンは1分以上使用できます(JWTの検証は行っていません)"};
    res.status(200);
    res.send(ok_msg);
  } catch(err) {
    Logger.SystemError("" + err);
    Error.HttpException.InternalServerError(res);
  }

}