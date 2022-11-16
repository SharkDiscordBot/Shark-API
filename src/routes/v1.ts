//import { Logger } from '@/modules/logger';
//import * as config from '@configs/config.json';
import * as express from 'express';
import * as Error from '@/modules/errorException';

const router = express.Router();

router.get("/", (req, res, next)  => {
  Error.HttpException.NotFound(res);
});

export default router;