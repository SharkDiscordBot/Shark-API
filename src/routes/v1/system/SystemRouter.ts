import * as express from "express";
import * as Error from "@/modules/ErrorException";

// routes 
import info from "@/routes/v1/system/info";
import status from "@/routes/v1/system/status";
import auth_check from "@/routes/v1/system/auth-check";
// end
const router = express.Router();

router.get("/", (req, res)  => {
  Error.HttpException.NotFound(res);
});

router.post("/", (req, res)  => {
  Error.HttpException.NotFound(res);
});

router.get("/status", (req, res) => {
  status(req, res);
});

router.get("/info", (req, res) => {
  info(req, res);
});

router.get("/auth-check", (req, res) => {
  auth_check(req,res);
});

export default router;