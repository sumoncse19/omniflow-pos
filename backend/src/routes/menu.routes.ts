import { Router } from "express";
import { z } from "zod";
import { validate } from "../middleware/validate";
import * as menuCtrl from "../controllers/menu.controller";

const router = Router();

const menuSchema = z.object({
  name: z.string().min(1).max(100),
  base_price: z.number().positive(),
});

router.get("/", menuCtrl.getAll);
router.get("/:id", menuCtrl.getOne);
router.post("/", validate(menuSchema), menuCtrl.create);
router.put("/:id", validate(menuSchema), menuCtrl.update);
router.delete("/:id", menuCtrl.remove);

export default router;
