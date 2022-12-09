//import { Logger } from "@/modules/logger";
//import * as config from "@configs/config.json";
import { Auth } from "@/utils/Auth";
import * as express from "express";
//import * as Error from "@/modules/ErrorException";

export default function(req: express.Request, res: express.Response){

  if(Auth.check_auth(req,res) == "NG") {
    return;
  }
  
  const id = req.params.UserID;
  const now_time = new Date().toLocaleString();
  const res_data = {"ID": id, "time": now_time, "status": "success", "http_status": 200, "message": "Debug"};
  res.json(res_data);
}