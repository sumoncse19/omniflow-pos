import { Request, Response } from "express";
import * as salesService from "../services/sales.service";
import { catchAsync } from "../utils/catchAsync";

export const getOutletSales = catchAsync(
  async (req: Request, res: Response) => {
    res.json(await salesService.getByOutlet(Number(req.params.outletId)));
  },
);

export const createSale = catchAsync(async (req: Request, res: Response) => {
  const sale = await salesService.createSale(
    Number(req.params.outletId),
    req.body.items,
  );
  res.status(201).json(sale);
});
