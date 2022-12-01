import * as express from "express";
import * as Error from "@/modules/ErrorException";
import info from "@/routes/v1/system/info";
import test from "@/routes/v1/system/test";
import status from "@/routes/v1/system/status";
const router = express.Router();

router.get("/", (req, res)  => {
  Error.HttpException.NotFound(res);
});

router.use("/info", info);
router.use("/test", test);
router.use("/status", status);

export default router;