//import { Logger } from "@/modules/logger";
//import * as config from "@configs/config.json";
import * as express from "express";
import * as Error from "@/modules/errorException";
import info from "@/routes/v1/system/info";
import test from "@/routes/v1/system/test";
const router = express.Router();

router.get("/", (req, res)  => {
  Error.HttpException.NotFound(res);
});

router.use("/info", info);
router.use("/test", test);

export default router;