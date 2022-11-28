import * as config from "@configs/config.json";
import * as child from "child_process";
import * as os from "os";
import { Logger } from "./Logger";
import * as mongoose from "mongoose";

export class Utils {

  public static get_os() { 
    if(os.platform() == "win32"){
      return "windows";
    }
    
    if(os.platform() == "darwin"){
      return "mac";
    }
        
    if(os.platform() == "linux"){
      return "linux";
    }
    return "unknown";
  }

  public static ping(server_addr: string) {
    if(!server_addr){
      return "Error: address not found";
    } else {

      let ping_cmd: string;
      let ping;
      let ping_cat;
      Logger.SystemInfo("os: " + this.get_os());
      if(this.get_os() == "windows"){
        return "0ms";
      } else {
        ping_cmd = child.execSync("ping -c 1 " + server_addr + " | grep time").toString();
        ping_cat = ping_cmd.indexOf("time"); 
        ping = ping_cmd.substring(ping_cat + 5);
        ping = ping.replace(/\r?\n/g, "");
        ping = ping.replace(/ /g, "");
        ping = ping.replace("ms", "");
        ping = Number(ping);
        ping = Math.ceil(ping);
        ping = String(ping);
        ping = ping + "ms";
        return ping;
      }
    }
  }

  public static CheckConfig(){
    
    // ポートが範囲を超えていないか確認
    if(config.server.port > 65535){
      Logger.SystemError("ポート番号が65535より大きいです");
      process.exit(1);
    } else {
      Logger.Debug("Passing: Port Number");
    }
    
    // mongoDBのURLが正しいか確認
    if(!config.server.mongodb_url.startsWith("mongodb")){
      Logger.SystemError("mongoDBのURLが正しくありません。configを修正してください");
      process.exit(1);
    } else {
      Logger.Debug("Passing: MongoDB URL");
    }

    // statusのURLが正しいかどうか確認

    if(config.settings.check_status.enable == false){
      Logger.Debug("Skip: Check API URL");
      Logger.SystemWarn("現在ステータスチェックが無効化されています。本番環境での使用はおすすめしません");
    } else {
      if(!config.settings.check_status.bot_status_URL.startsWith("http")){
        Logger.SystemError("BotのステータスURLが正しくありません。URLの値はhttpもしくはhttpsから始まる必要があります。");
        process.exit(1);
      }

      if(!config.settings.check_status.bot_status_URL.endsWith("/api/v1/status")){
        Logger.SystemError("BotのステータスURLが正しくありません。URLの値にはAPIのエンドポイントを含む必要があります。本番環境では正しく動作しない恐れがあります");
      } 

      if(!config.settings.check_status.frontend_status_URL.startsWith("http")){
        Logger.SystemError("webサーバーのステータスURLが正しくありません。URLの値はhttpもしくはhttpsから始まる必要があります。");
        process.exit(1);
      }

      if(!config.settings.check_status.frontend_status_URL.endsWith("/api/v1/status")){
        Logger.SystemError("WebサーバーのステータスURLが正しくありません。URLの値にはAPIのエンドポイントを含む必要があります。本番環境では正しく動作しない恐れがあります");
      }

      Logger.Debug("Passing: Status URL");

      if(config.settings.check_status.disabled_status == "up" || config.settings.check_status.disabled_status == "warn" || config.settings.check_status.disabled_status == "down"){
        Logger.Debug("Passing: Status (config:15)");
      } else {
        Logger.SystemError("ステータス非参照時のステータスが正しくありません (config:15)");
        process.exit(1);
      }
    }
  }

  public static connect_mongodb() {
    mongoose.connect(config.server.mongodb_url).catch((error: string) => {
      Logger.SystemError(error);
      Logger.SystemError("mongodbの接続中にエラーが発生しました");
      Logger.SystemError("configの値,サーバーのアクセス制御が正しいか確認してください");
      process.exit(1);
    });
    Logger.SystemInfo("データベースの接続に成功しました");
  }
}