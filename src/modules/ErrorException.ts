import * as express from "express";

export class HttpException {

  public static BadRequest(res: express.Response) {
    res.status(400);
    res.header("Content-Type", "application/json; charset=utf-8");
    const now_time = new Date().toLocaleString();
    const message = {"time": now_time, "status": "error", "http_status": 400, "message": "BadRequest"};
    res.json(message);
  }

  public static Unauthorized(res: express.Response) {
    res.status(401);
    res.header("Content-Type", "application/json; charset=utf-8");
    const now_time = new Date().toLocaleString();
    const message = {"time": now_time, "status": "error", "http_status": 401, "message": "Unauthorized"};
    res.json(message);
  }

  public static Forbidden(res: express.Response) {
    res.status(403);
    res.header("Content-Type", "application/json; charset=utf-8");
    const now_time = new Date().toLocaleString();
    const message = {"time": now_time, "status": "error", "http_status": 403, "message": "Forbidden"};
    res.json(message);
  }

  public static NotFound(res: express.Response) {
    res.status(404);
    res.header("Content-Type", "application/json; charset=utf-8");
    const now_time = new Date().toLocaleString();
    const message = {"time": now_time, "status": "error", "http_status": 404, "message": "NotFound"};
    res.json(message);
  }

  public static PreconditionFailed(res: express.Response) {
    res.status(412);
    res.header("Content-Type", "application/json; charset=utf-8");
    const now_time = new Date().toLocaleString();
    const message = {"time": now_time, "status": "error", "http_status": 412, "message": "Precondition Failed"};
    res.json(message);
  }

  public static InternalServerError(res: express.Response) {
    res.status(500);
    res.header("Content-Type", "application/json; charset=utf-8");
    const now_time = new Date().toLocaleString();
    const message = {"time": now_time, "status": "error", "http_status": 500, "message": "InternalServerError"};
    res.json(message);
  }
}
