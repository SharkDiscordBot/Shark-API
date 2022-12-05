//import { Logger } from "@/modules/logger";
//import * as config from "@configs/config.json";
import * as express from "express";
import * as Error from "@/modules/ErrorException";

// routes
import systems from "@/routes/v1/system/SystemRouter";
import UserRouter from "@/routes/v1/users/UserRouter";
// end

const router = express.Router();

router.get("/", (req, res)  => {
  Error.HttpException.NotFound(res);
});

router.use("/systems", systems);
router.use("/users", UserRouter);
export default router;