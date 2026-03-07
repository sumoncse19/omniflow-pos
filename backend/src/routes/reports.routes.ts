import { Router } from "express";
import * as reportsCtrl from "../controllers/reports.controller";

const router = Router();

router.get("/revenue", reportsCtrl.getRevenueByOutlet);
router.get("/top-items", reportsCtrl.getTopItems);

export default router;
