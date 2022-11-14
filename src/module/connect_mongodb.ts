import * as mongoose from 'mongoose';
import * as config from '@configs/config.json';
import { Logger } from '@/utils/logger';

export async function connect_mongodb(){
  await mongoose.connect(config.server.mongodb_url).catch((error: string) => {
    Logger.SystemError(error);
    Logger.SystemError("mongodbの接続中にエラーが発生しました");
    Logger.SystemError("configの値,サーバーのアクセス制御が正しいか確認してください");
    process.exit(1);
  });
  Logger.AccessInfo("データベースの接続に成功しました")
}