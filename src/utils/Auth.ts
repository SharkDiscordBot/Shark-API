import * as express from "express";
import * as jwt from "jsonwebtoken";
import * as config from "@configs/config.json";
import { HttpException } from "@/modules/ErrorException";
import { Logger } from "@/modules/Logger";

export class Auth {
  public static check_auth(req: express.Request, res: express.Response) {

    if (!req.headers.authorization) {
      HttpException.Unauthorized(res);
      return "NG";
    }
  
    const token = req.headers.authorization;
    let decoded;
    try {
      decoded = jwt.verify(token, config.server.auth.auth_key);
    } catch (err) {
      HttpException.Unauthorized(res);
      Logger.SystemError("" + err);
      return "NG";
    }
  
    if (!decoded) {
      HttpException.Unauthorized(res);
      return "NG";
    }
    return "OK";
  
  }
}