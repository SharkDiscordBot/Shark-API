//import { Logger } from "@/modules/logger";
//import * as config from "@configs/config.json";
import * as express from "express";
import * as Error from "@/modules/ErrorException";
import info from "@/routes/v1/users/info";
const router = express.Router();

router.get("/", (req, res)  => {
  Error.HttpException.NotFound(res);
});

router.get("/:UserID/info", (req, res)  => {
  info(req, res);
});

export default router;