import * as config from "@configs/config.json";
import { Logger } from "@/modules/Logger";
import * as mongoose from "mongoose";

export class Utils {

  public static connect_mongodb() {
    mongoose.connect(config.server.mongodb_url).catch((error: string) => {
      Logger.SystemError(error);
      Logger.SystemError("mongodbの接続中にエラーが発生しました");
      Logger.SystemError("configの値,サーバーのアクセス制御が正しいか確認してください");
      process.exit(1);
    });
    Logger.SystemInfo("データベースの接続に成功しました");
  }

  public static decode_jwt_token(token: string) {
    return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
  }
}