import * as inventoryRepo from "../repositories/inventory.repo";

export async function getByOutlet(outletId: number) {
  return inventoryRepo.getByOutlet(outletId);
}

export async function upsertStock(
  outletId: number,
  menuItemId: number,
  stock: number,
) {
  return inventoryRepo.upsertStock(outletId, menuItemId, stock);
}
