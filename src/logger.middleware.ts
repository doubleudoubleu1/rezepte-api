import { Request, Response, NextFunction } from "express";

export function logger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  const url = req.originalUrl ?? req.url;
  res.on("finish", () => {
    console.log(`${req.method} ${url} → ${res.statusCode} (${Date.now() - start} ms)`);
  });
  next();
}
