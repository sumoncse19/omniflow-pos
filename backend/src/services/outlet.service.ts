import * as outletRepo from "../repositories/outlet.repo";
import * as inventoryRepo from "../repositories/inventory.repo";
import { AppError } from "../middleware/errors";

export async function getAll() {
  return outletRepo.findAll();
}

export async function getOne(id: number) {
  const outlet = await outletRepo.findById(id);
  if (!outlet) throw new AppError("Outlet not found", 404);
  return outlet;
}

export async function create(name: string, location?: string) {
  return outletRepo.create(1, name, location);
}

export async function getOutletMenu(outletId: number) {
  return outletRepo.getOutletMenu(outletId);
}

export async function assignMenuItem(
  outletId: number,
  menuItemId: number,
  overridePrice?: number | null,
) {
  return outletRepo.assignMenuItem(outletId, menuItemId, overridePrice);
}

export async function removeMenuItem(outletId: number, menuItemId: number) {
  const removed = await outletRepo.removeMenuItem(outletId, menuItemId);
  if (!removed)
    throw new AppError("Menu item not assigned to this outlet", 404);
  await inventoryRepo.removeStock(outletId, menuItemId);
}
