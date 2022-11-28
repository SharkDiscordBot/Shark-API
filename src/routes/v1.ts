//import { Logger } from "@/modules/logger";
//import * as config from "@configs/config.json";
import * as express from "express";
import * as Error from "@/modules/ErrorException";
import systems from "@/routes/v1/system/system";

const router = express.Router();

router.get("/", (req, res)  => {
  Error.HttpException.NotFound(res);
});

router.use("/systems", systems);
export default router;