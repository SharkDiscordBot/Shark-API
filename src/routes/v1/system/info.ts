//import { Logger } from '@/modules/logger';
//import * as config from '@configs/config.json';
import * as express from 'express';
import * as os from 'os';
import * as Error from '@/modules/errorException';
import * as system_version from '@root/system.json';
import SystemModel from '@/schema/system';
const router = express.Router();

router.get("/", (req, res, next)  => {
  res.status(200);
  res.header('Content-Type', 'application/json; charset=utf-8');
  let now_time = new Date().toLocaleString();
  async function data_send() {
    let system_data = await SystemModel.findOne({_id: "system_data"});
    let commit_hash = system_data?.commit_hash;
    let branch = system_data?.local_branch;
    let message = {"os": os.type(), "version": system_version.version, "hash": commit_hash, "local_branch": branch, "time": now_time, "status": "success", "http_status": 200, "message": "none"};
    await res.send(message);
  }
  data_send();
});

router.post("/", (req, res, next)  => {
  Error.HttpException.BadRequest(res);
});

export default router;