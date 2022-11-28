//import { Logger } from "@/modules/logger";
//import * as config from "@configs/config.json";
import * as express from "express";
import * as Error from "@/modules/ErrorException";
const router = express.Router();

router.get("/", (req, res)  => {
  res.status(200);
  res.header("Content-Type", "application/json; charset=utf-8");
  const now_time = new Date().toLocaleString();
  const message = {"your_ip": req.ip, "time": now_time, "status": "success", "http_status": 200, "message": "none"};
  res.send(message);
});

router.post("/", (req, res)  => {
  Error.HttpException.BadRequest(res);
});

export default router;