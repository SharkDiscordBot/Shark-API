import 'module-alias/register';
import { Logger } from '@/utils/logger';
//import * as config from '@configs/config.json';
import * as mongodb from '@/module/connect_mongodb';

export {}

Logger.SystemInfo("しゃーくBot Backend Server");

// mongoDBに接続

mongodb.connect_mongodb();