import { Request, Response } from "express";
import * as inventoryRepo from "../repositories/inventory.repo";
import { catchAsync } from "../utils/catchAsync";

export const getOutletInventory = catchAsync(
  async (req: Request, res: Response) => {
    const outletId = Number(req.params.outletId);
    res.json(await inventoryRepo.getByOutlet(outletId));
  },
);

export const upsertStock = catchAsync(async (req: Request, res: Response) => {
  const outletId = Number(req.params.outletId);
  const { menu_item_id, stock } = req.body;
  res.json(await inventoryRepo.upsertStock(outletId, menu_item_id, stock));
});
