import { Router } from "express";
import * as inventoryCtrl from "../controllers/inventory.controller";
import { z } from "zod";
import { validate } from "../middleware/validate";

const router = Router({ mergeParams: true });

const upsertStockSchema = z.object({
  menu_item_id: z.number().int().positive(),
  stock: z.number().int().min(0),
});

router.get("/", inventoryCtrl.getOutletInventory);
router.put("/", validate(upsertStockSchema), inventoryCtrl.upsertStock);

export default router;
