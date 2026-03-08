import { Request, Response } from "express";
import * as menuService from "../services/menu.service";
import { asyncHandler } from "../utils/asyncHandler";

export const getAll = asyncHandler(async (_req: Request, res: Response) => {
  res.json(await menuService.getAll());
});

export const getOne = asyncHandler(async (req: Request, res: Response) => {
  res.json(await menuService.getOne(Number(req.params.id)));
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const item = await menuService.create(req.body.name, req.body.base_price);
  res.status(201).json(item);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const item = await menuService.update(
    Number(req.params.id),
    req.body.name,
    req.body.base_price,
  );
  res.json(item);
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  await menuService.remove(Number(req.params.id));
  res.status(204).send();
});
