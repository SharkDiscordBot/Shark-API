//import { Logger } from "@/modules/logger";
//import * as config from "@configs/config.json";
import * as express from "express";
import * as os from "os";
import * as Error from "@/modules/ErrorException";
import * as system_version from "@root/system.json";
import SystemModel from "@/schema/system";

export default async function(req: express.Request, res: express.Response) {
  const now_time = new Date().toLocaleString();
  const system_data = await SystemModel.findOne({_id: "system_data"});
  
  if(!system_data) {
    Error.HttpException.InternalServerError(res);
    return;
  }

  const commit_hash = system_data.commit_hash;
  const branch = system_data.local_branch;
  const message = {"os": os.type(), "version": system_version.version, "hash": commit_hash, "local_branch": branch, "time": now_time, "status": "success", "http_status": 200, "message": "none"};
  await res.json(message);
}