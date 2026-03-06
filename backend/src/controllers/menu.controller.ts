import { Request, Response, NextFunction } from "express";
import * as menuService from "../services/menu.service";

export async function getAll(req: Request, res: Response, next: NextFunction) {
  try {
    const items = await menuService.getAll();
    res.json(items);
  } catch (err) {
    next(err);
  }
}

export async function getOne(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await menuService.getOne(Number(req.params.id));
    res.json(item);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await menuService.create(req.body.name, req.body.base_price);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await menuService.update(
      Number(req.params.id),
      req.body.name,
      req.body.base_price,
    );
    res.json(item);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await menuService.remove(Number(req.params.id));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
