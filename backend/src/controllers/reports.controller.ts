import { Request, Response, NextFunction } from "express";
import * as reportsService from "../services/reports.service";

export async function getRevenueByOutlet(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const data = await reportsService.getRevenueByOutlet();
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function getTopItems(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const outletId = Number(req.params.outletId);
    const limit = Number(req.query.limit) || 5;
    const data = await reportsService.getTopItems(outletId, limit);
    res.json(data);
  } catch (err) {
    next(err);
  }
}
