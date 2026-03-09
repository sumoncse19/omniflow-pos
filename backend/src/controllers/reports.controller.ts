import { Request, Response } from "express";
import * as reportsRepo from "../repositories/reports.repo";
import { asyncHandler } from "../utils/asyncHandler";

export const getRevenueByOutlet = asyncHandler(
  async (_req: Request, res: Response) => {
    res.json(await reportsRepo.getRevenueByOutlet());
  },
);

export const getTopItems = asyncHandler(async (req: Request, res: Response) => {
  const limit = Number(req.query.limit) || 5;
  res.json(await reportsRepo.getTopItems(Number(req.params.outletId), limit));
});
