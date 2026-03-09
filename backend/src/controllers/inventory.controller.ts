import { Request, Response } from "express";
import * as inventoryRepo from "../repositories/inventory.repo";
import { asyncHandler } from "../utils/asyncHandler";

export const getOutletInventory = asyncHandler(
  async (req: Request, res: Response) => {
    const outletId = Number(req.params.outletId);
    res.json(await inventoryRepo.getByOutlet(outletId));
  },
);

export const upsertStock = asyncHandler(async (req: Request, res: Response) => {
  const outletId = Number(req.params.outletId);
  const { menu_item_id, stock } = req.body;
  res.json(await inventoryRepo.upsertStock(outletId, menu_item_id, stock));
});
