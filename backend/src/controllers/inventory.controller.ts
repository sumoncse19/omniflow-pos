import { Request, Response, NextFunction } from "express";
import * as inventoryService from "../services/inventory.service";

export async function getOutletInventory(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const inventory = await inventoryService.getByOutlet(
      Number(req.params.outletId),
    );
    res.json(inventory);
  } catch (error) {
    next(error);
  }
}

export async function upsertStock(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const outletId = Number(req.params.outletId);
    const { menu_item_id, stock } = req.body;

    const result = await inventoryService.upsertStock(
      outletId,
      menu_item_id,
      stock,
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
}
