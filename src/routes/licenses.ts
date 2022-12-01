import * as express from "express";
import * as Error from "@/modules/ErrorException";

const router = express.Router();

router.get("/", (req, res)  => {
  res.render("licenses");
});

router.post("/", (req, res)  => {
  Error.HttpException.NotFound(res);
});
export default router;