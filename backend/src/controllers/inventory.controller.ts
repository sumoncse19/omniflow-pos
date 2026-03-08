import { Request, Response } from "express";
import * as inventoryService from "../services/inventory.service";
import { asyncHandler } from "../utils/asyncHandler";

export const getOutletInventory = asyncHandler(
  async (req: Request, res: Response) => {
    res.json(await inventoryService.getByOutlet(Number(req.params.outletId)));
  },
);

export const upsertStock = asyncHandler(async (req: Request, res: Response) => {
  const result = await inventoryService.upsertStock(
    Number(req.params.outletId),
    req.body.menu_item_id,
    req.body.stock,
  );
  res.json(result);
});
