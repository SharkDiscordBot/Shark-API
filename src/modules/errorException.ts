export class HttpException {

  public static BadRequest(res: any) {
    res.status(400);
    res.header('Content-Type', 'application/json; charset=utf-8');
    let now_time = new Date().toLocaleString();
    let message = {"time": now_time, "status": "error", "http_status": 400, "message": "BadRequest"};
    res.send(message);
  }

  public static Unauthorized(res: any) {
    res.status(401);
    res.header('Content-Type', 'application/json; charset=utf-8');
    let now_time = new Date().toLocaleString();
    let message = {"time": now_time, "status": "error", "http_status": 401, "message": "Unauthorized"};
    res.send(message);
  }

  public static Forbidden(res: any) {
    res.status(403);
    res.header('Content-Type', 'application/json; charset=utf-8');
    let now_time = new Date().toLocaleString();
    let message = {"time": now_time, "status": "error", "http_status": 403, "message": "Forbidden"};
    res.send(message);
  }

  public static NotFound(res: any) {
    res.status(404);
    res.header('Content-Type', 'application/json; charset=utf-8');
    let now_time = new Date().toLocaleString();
    let message = {"time": now_time, "status": "error", "http_status": 404, "message": "NotFound"};
    res.send(message);
  }

  public static PreconditionFailed(res: any) {
    res.status(412);
    res.header('Content-Type', 'application/json; charset=utf-8');
    let now_time = new Date().toLocaleString();
    let message = {"time": now_time, "status": "error", "http_status": 412, "message": "Precondition Failed"};
    res.send(message);
  }

  public static InternalServerError(res: any) {
    res.status(500);
    res.header('Content-Type', 'application/json; charset=utf-8');
    let now_time = new Date().toLocaleString();
    let message = {"time": now_time, "status": "error", "http_status": 500, "message": "InternalServerError"};
    res.send(message);
  }
}
