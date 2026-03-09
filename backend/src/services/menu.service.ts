import * as menuRepo from "../repositories/menu.repo";
import { AppError } from "../middleware/errors";

export function getAll() {
  return menuRepo.findAll();
}

export async function getOne(id: number) {
  const item = await menuRepo.findById(id);
  if (!item) throw new AppError(`Menu item ${id} not found`, 404);
  return item;
}

export function create(name: string, price: number) {
  return menuRepo.create(name, price);
}

export async function update(id: number, name: string, price: number) {
  const updated = await menuRepo.update(id, name, price);
  if (!updated) throw new AppError(`Menu item ${id} not found`, 404);
  return updated;
}

export async function remove(id: number) {
  const deleted = await menuRepo.remove(id);
  if (!deleted) throw new AppError(`Nothing to delete (id=${id})`, 404);
}
