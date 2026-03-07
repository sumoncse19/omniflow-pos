import { Request, Response, NextFunction } from "express";
import * as salesService from "../services/sales.service";

export async function getOutletSales(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const outletId = Number(req.params.outletId);
    const sales = await salesService.getByOutlet(outletId);
    res.json(sales);
  } catch (err) {
    next(err);
  }
}

export async function createSale(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const outletId = Number(req.params.outletId);
    const { items } = req.body;
    const sale = await salesService.createSale(outletId, items);
    res.status(201).json(sale);
  } catch (err) {
    next(err);
  }
}
