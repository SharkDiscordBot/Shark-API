import * as config from "@configs/config.json";
import StatusModel from "@/schema/status";
import { Logger } from "./Logger";
import * as request from "request";

// 毎分実行
export class run_min {
  public static async CheckStatus(){

    const bot_status = await StatusModel.findOne({ _id: "bot" });
    const frontend_status = await StatusModel.findOne({ _id: "frontend" });

    async function write_db(write_type: string, id: string, status: string, ping: string, version: string) {
      if(write_type == "create"){
        const create_data = await StatusModel.create({
          _id: id,
          version: version,
          ping: ping,
          status: status
        });
        create_data.save().catch((err: string) => {
          Logger.SystemError(err);
          Logger.SystemError("DBの書き込みに失敗しました...");
          Logger.SystemError("書き込もうとしたデータ: ステータスデータ");
        });
        return;
      }

      if(write_type == "update"){

        const update_id = await StatusModel.findOne({ _id: id });

        if(!update_id){
          return;
        }

        await update_id.updateOne({
          version: version,
          ping: ping,
          status: status
        });
        return;
      }
      Logger.SystemError("SyntaxError(CronSystem:run_min.CheckStatus): write_typeには create もしくは update のみ設定できます");
    }

    if(config.settings.check_status.enable == true){
      await request.get({ 
        url: config.settings.check_status.bot_status_URL,
      }, function (bot_error, bot_response, bot_body_data) {
        request.get({ 
          url: config.settings.check_status.frontend_status_URL,
        }, function (front_error, front_response, front_body_data) {

          // bot_status

          if(!bot_error && (bot_response && bot_response.statusCode) == 200) {
            const bot_body = JSON.parse(bot_body_data);
            if(!bot_status){
              write_db("create", "bot", bot_body.status, bot_body.ping, bot_body.version);
              Logger.Debug("Success: Create Bot Status Data");
            } else {
              write_db("update", "bot", bot_body.status, bot_body.ping, bot_body.version);
              Logger.Debug("Success: Update Bot Status Data");
            }
          } else {
            if(!bot_status){
              write_db("create", "bot", "down", "0ms", "0.0.0");
              Logger.Debug("Success: Create Bot Status Data (Status Get Error)");
            } else {
              write_db("update", "bot", "down", "0ms", "0.0.0");
              Logger.Debug("Success: Update Bot Status Data (Status Get Error)");
            }
            Logger.SystemError("ステータス情報の取得に失敗しました");
            Logger.SystemError("Botサーバーが正常な動作をしていない可能性がります");
          }

          if(!front_error && (front_response && front_response.statusCode) == 200) {
            const front_body = JSON.parse(front_body_data);
            if(!frontend_status){
              write_db("create", "frontend", front_body.status, front_body.ping, front_body.version);
              Logger.Debug("Success: Create Frontend Status Data");
            } else {
              write_db("update", "frontend", front_body.status, front_body.ping, front_body.version);
              Logger.Debug("Success: Update Frontend Status Data");
            }
          } else {
            if(!frontend_status){
              write_db("create", "frontend", "down", "0ms", "0.0.0");
              Logger.Debug("Success: Create Frontend Status Data (Status Get Error)");
            } else {
              write_db("update", "frontend", "down", "0ms", "0.0.0");
              Logger.Debug("Success: Update Frontend Status Data (Status Get Error)");
            }
            Logger.SystemError("ステータス情報の取得に失敗しました");
            Logger.SystemError("Webサーバーが正常な動作をしていない可能性がります");
          }
        });
      });
    } else {
      
      if(!bot_status){
        await write_db("create", "bot", config.settings.check_status.disabled_status, "0ms", "0.0.0");
        Logger.Debug("Success: Create Bot Status Data");
      } else {
        await write_db("update", "bot", config.settings.check_status.disabled_status, "0ms", "0.0.0");
        Logger.Debug("Success: Update Bot Status Data");
      }
      
      if(!frontend_status){
        await write_db("create", "frontend", config.settings.check_status.disabled_status, "0ms", "0.0.0");
        Logger.Debug("Success: Create Frontend Status Data");
      } else {
        await write_db("update", "frontend", config.settings.check_status.disabled_status, "0ms", "0.0.0");
        Logger.Debug("Success: Update Frontend Status Data");
      }

    }
  }
}