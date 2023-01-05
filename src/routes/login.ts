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
    Logger.SystemError("エラー: サーバーに送信されたAPI_IDはDBに存在しません。入力を間違えていないか確認してください。DBのデータを間違えて削除した場合、再起動してください");
    HttpException.Unauthorized(res);
    return;
  }

  try {
    Logger.Debug("Start Gen_key request_ip:" + req.ip + " UserAgent: " + req.headers["user-agent"]);
    const decipher = crypto.createDecipheriv("aes-256-cbc", config.server.auth.auth_key, auth.iv);
    const api_key = decipher.update(req.body.api_key, "hex", "utf-8") + decipher.final("utf-8");
    Logger.Debug("success: API_Key decipher request_ip: " + req.ip + " UserAgent: " + req.headers["user-agent"]);
    const hash_api_key = bcrypt.compareSync(api_key, auth.api_key);
    Logger.Debug("success: API_Key cipher(bcrypt) request_ip: " + req.ip + " UserAgent: " + req.headers["user-agent"]);

    if(hash_api_key == true){
      const list = "1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";

      const jwt_id = Array.from(crypto.randomFillSync(new Uint8Array(24))).map((n)=>list[n%list.length]).join("");Logger.Debug("success: create SessionID" + " ID: " + jwt_id + " request_ip: " + req.ip + " UserAgent: " + req.headers["user-agent"]);
      const payload = { id: jwt_id};
      const token = jwt.sign(payload, config.server.auth.auth_key, { expiresIn: "1h" });
      Logger.Debug("success: create Session" + " ID: " + jwt_id + " request_ip: " + req.ip + " UserAgent: " + req.headers["user-agent"]);

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