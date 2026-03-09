import { Request, Response } from "express";
import * as reportsRepo from "../repositories/reports.repo";
import { catchAsync } from "../utils/catchAsync";

export const getRevenueByOutlet = catchAsync(
  async (_req: Request, res: Response) => {
    res.json(await reportsRepo.getRevenueByOutlet());
  },
);

export const getTopItems = catchAsync(async (req: Request, res: Response) => {
  const limit = Number(req.query.limit) || 5;
  res.json(await reportsRepo.getTopItems(Number(req.params.outletId), limit));
});
