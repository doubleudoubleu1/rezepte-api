import { Request, Response, NextFunction } from "express";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(`${err.name}: ${err.message}`);       // Name + Nachricht im Terminal

  const status = err.status ?? 500;                    // kein eigener Status -> 500

  res.status(status).json({ fehler: err.message });
}
