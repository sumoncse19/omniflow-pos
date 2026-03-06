import { Router } from "express";
import { z } from "zod";
import { validate } from "../middleware/validate";
import * as outletCtrl from "../controllers/outlet.controller";

const router = Router();

const outletSchema = z.object({
  name: z.string().min(1).max(100),
  location: z.string().max(200).optional(),
});

const assignSchema = z.object({
  menu_item_id: z.number().int().positive(),
  override_price: z.number().positive().optional(),
});

router.get("/", outletCtrl.getAll);
router.get("/:id", outletCtrl.getOne);
router.post("/", validate(outletSchema), outletCtrl.create);

router.get("/:id/menu", outletCtrl.getOutletMenu);
router.post("/:id/menu", validate(assignSchema), outletCtrl.assignMenuItem);
router.delete("/:id/menu/:menuItemId", outletCtrl.removeMenuItem);

export default router;
