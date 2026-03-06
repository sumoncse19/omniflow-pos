import * as menuRepo from '../repositories/menu.repo'
import { AppError } from '../middleware/errors'

export async function getAll() {
  return menuRepo.findAll()
}

export async function getOne(id: number) {
  const item = await menuRepo.findById(id)
  if (!item) throw new AppError('Menu item not found', 404)
  return item
}

export async function create(name: string, price: number) {
  return menuRepo.create(name, price)
}

export async function update(id: number, name: string, price: number) {
  const item = await menuRepo.update(id, name, price)
  if (!item) throw new AppError('Menu item not found', 404)
  return item
}

export async function remove(id: number) {
  const deleted = await menuRepo.remove(id)
  if (!deleted) throw new AppError('Menu item not found', 404)
}
