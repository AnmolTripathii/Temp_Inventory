import { Router } from "express";
import {
  getLowStockProducts,
  getInventoryValue,
  getProductsBySupplier,
} from "../Controllers/reportController.js";

const router = Router();

router.get("/low-stock", getLowStockProducts);
router.get("/inventory-value", getInventoryValue);
router.get("/products-by-supplier/:id", getProductsBySupplier);

export default router;
