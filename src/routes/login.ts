import * as express from "express";
import * as crypto from "crypto";
import * as config from "@configs/config.json";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import AuthModel from "@/schema/auth";
import { HttpException } from "@/modules/ErrorException";
import { Logger } from "@/modules/Logger";

export default async function(req: express.Request, res: express.Response) {
  const now_time = new Date().toLocaleString();
  Logger.SystemInfo("ログイン処理を開始します。これには時間がかかる場合があります");
  
  if(!req.body) {
    HttpException.BadRequest(res);
    return;
  }

  if(!req.body.api_key || !req.body.api_id ) {
    HttpException.BadRequest(res);
    return;
  }

  const auth = await AuthModel.findOne({ _id: req.body.api_id });

  if(!auth || !auth.iv || !auth.api_key ) {
    Logger.SystemError("エラー: APIキーがデータベースに登録されていません。本APIサーバーを再起動をするとAPIキーが発行されます");
    HttpException.InternalServerError(res);
    return;
  }

  try {
    const decipher = await crypto.createDecipheriv("aes-256-cbc", config.server.auth.auth_key, auth.iv);
    const api_key = await decipher.update(req.body.api_key, "hex", "utf-8") + decipher.final("utf-8");
    const hash_api_key = await bcrypt.compareSync(api_key, auth.api_key);

    if(hash_api_key == true){
      const list = "1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";
      const jwt_id = await Array.from(crypto.randomFillSync(new Uint8Array(24))).map((n)=>list[n%list.length]).join("");
      const payload = { id: jwt_id};
      const token = await jwt.sign(payload, config.server.auth.auth_key, { expiresIn: "1h" });
      const res_message = {"auth": "ok", "id": jwt_id, "token": token, "time": now_time, "http_status": 200, "status": "success", "message": "none"};
      await res.json(res_message);
    } else {
      HttpException.Unauthorized(res);
      return;
    }
  } catch(err) {
    // APIキーの復号失敗時
    Logger.SystemWarn("APIキーの復号処理中にエラーが発生しました。誤ったAPIキーが入力された可能性があります");
    Logger.SystemWarn("" + err);
    HttpException.Unauthorized(res);
    return;
  }
  
}