import { Router } from "express";
import * as salesCtrl from "../controllers/sales.controller";
import { z } from "zod";
import { validate } from "../middleware/validate";

const router = Router({ mergeParams: true });

const createSaleSchema = z.object({
  items: z
    .array(
      z.object({
        menu_item_id: z.number().int().positive(),
        name: z.string().min(1),
        qty: z.number().int().positive(),
        price: z.number().positive(),
      }),
    )
    .min(1),
});

router.get("/", salesCtrl.getOutletSales);
router.post("/", validate(createSaleSchema), salesCtrl.createSale);

export default router;
