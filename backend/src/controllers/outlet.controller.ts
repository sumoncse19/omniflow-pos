import { Request, Response } from "express";
import * as outletService from "../services/outlet.service";
import { catchAsync } from "../utils/catchAsync";

export const getAll = catchAsync(async (_req: Request, res: Response) => {
  res.json(await outletService.getAll());
});

export const getOne = catchAsync(async (req: Request, res: Response) => {
  res.json(await outletService.getOne(Number(req.params.id)));
});

export const create = catchAsync(async (req: Request, res: Response) => {
  const outlet = await outletService.create(req.body.name, req.body.location);
  res.status(201).json(outlet);
});

export const getOutletMenu = catchAsync(async (req: Request, res: Response) => {
  res.json(await outletService.getOutletMenu(Number(req.params.id)));
});

export const assignMenuItem = catchAsync(
  async (req: Request, res: Response) => {
    const item = await outletService.assignMenuItem(
      Number(req.params.id),
      req.body.menu_item_id,
      req.body.override_price,
    );
    res.status(201).json(item);
  },
);

export const removeMenuItem = catchAsync(
  async (req: Request, res: Response) => {
    await outletService.removeMenuItem(
      Number(req.params.id),
      Number(req.params.menuItemId),
    );
    res.status(204).send();
  },
);
