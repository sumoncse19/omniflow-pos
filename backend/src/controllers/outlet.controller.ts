import { Request, Response, NextFunction } from 'express'
import * as outletService from '../services/outlet.service'

export async function getAll(req: Request, res: Response, next: NextFunction) {
  try {
    const outlets = await outletService.getAll()
    res.json(outlets)
  } catch (err) {
    next(err)
  }
}

export async function getOne(req: Request, res: Response, next: NextFunction) {
  try {
    const outlet = await outletService.getOne(Number(req.params.id))
    res.json(outlet)
  } catch (err) {
    next(err)
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const outlet = await outletService.create(req.body.name, req.body.location)
    res.status(201).json(outlet)
  } catch (err) {
    next(err)
  }
}

export async function getOutletMenu(req: Request, res: Response, next: NextFunction) {
  try {
    const menu = await outletService.getOutletMenu(Number(req.params.id))
    res.json(menu)
  } catch (err) {
    next(err)
  }
}

export async function assignMenuItem(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await outletService.assignMenuItem(
      Number(req.params.id),
      req.body.menu_item_id,
      req.body.override_price
    )
    res.status(201).json(item)
  } catch (err) {
    next(err)
  }
}

export async function removeMenuItem(req: Request, res: Response, next: NextFunction) {
  try {
    await outletService.removeMenuItem(Number(req.params.id), Number(req.params.menuItemId))
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}
