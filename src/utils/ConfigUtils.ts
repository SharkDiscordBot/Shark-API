import * as config from "@configs/config.json";
import { Logger } from "@/modules/Logger";
import * as fs from "fs";

export class ConfigUtils {
  public static check_config() {
    // ポートが範囲を超えていないか確認
    if(config.server.port > 65535){
      Logger.SystemError("ポート番号が65535より大きいです");
      process.exit(1);
    } else {
      Logger.Debug("Passing: Port Number");
    }

    if(config.server.ssl.ssl_port > 65535) {
      Logger.SystemError("ポート番号が65535より大きいです");
      process.exit(1);
    } else {
      Logger.Debug("Passing: HTTPS Port Number");
    }

    if(config.server.port == config.server.ssl.ssl_port) {
      Logger.SystemError("HTTPSサーバーのポート番号とメインポート番号が同一です");
      process.exit(1);
    } else {
      Logger.Debug("Passing: Port Number Check");
    }

    if(config.server.ssl.enable == true) {
      if(!fs.existsSync(config.server.ssl.key_path)) {
        Logger.SystemError("SSL証明書が存在しません。ファイルのパスを確認してください");
        process.exit(1);
      }
      if(!fs.existsSync(config.server.ssl.cert_path)) {
        Logger.SystemError("SSL証明書が存在しません。ファイルのパスを確認してください");
        process.exit(1);
      }
    }

    // APIの暗号鍵の文字数制限
    if(config.server.auth.auth_key.length > 32) {
      Logger.SystemError("API認証鍵は32文字以下である必要があります");
      process.exit(1);
    } else {
      Logger.Debug("文字数: " + config.server.auth.auth_key.length);
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
      if(config.settings.check_status.disabled_status == "up" || config.settings.check_status.disabled_status == "warn" || config.settings.check_status.disabled_status == "down"){
        Logger.Debug("Passing: Status (config:15)");
      } else {
        Logger.SystemError("ステータス非参照時のステータスが正しくありません (config:15)");
        process.exit(1);
      }
    }
  }
}