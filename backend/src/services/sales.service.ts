import * as salesRepo from "../repositories/sales.repo";
import { AppError } from "../middleware/errors";

export function getByOutlet(outletId: number) {
  return salesRepo.getByOutlet(outletId);
}

export function createSale(
  outletId: number,
  items: { menu_item_id: number; name: string; qty: number; price: number }[],
) {
  if (!items.length)
    throw new AppError("You can't create sale with 0 items.", 400);
  return salesRepo.createSale(outletId, items);
}
