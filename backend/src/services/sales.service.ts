import * as salesRepo from "../repositories/sales.repo";
import { AppError } from "../middleware/errors";

export async function getByOutlet(outletId: number) {
  return salesRepo.getByOutlet(outletId);
}

export async function createSale(
  outletId: number,
  items: { menu_item_id: number; name: string; qty: number; price: number }[],
) {
  if (items.length === 0) {
    throw new AppError("Cannot create a sale with no items", 400);
  }

  return salesRepo.createSale(outletId, items);
}
