import { Request, Response } from "express";
import * as reportsService from "../services/reports.service";
import { asyncHandler } from "../utils/asyncHandler";

export const getRevenueByOutlet = asyncHandler(
  async (_req: Request, res: Response) => {
    res.json(await reportsService.getRevenueByOutlet());
  },
);

export const getTopItems = asyncHandler(async (req: Request, res: Response) => {
  const outletId = Number(req.params.outletId);
  const limit = Number(req.query.limit) || 5;
  res.json(await reportsService.getTopItems(outletId, limit));
});
