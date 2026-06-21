import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware";
import saleController from "./sale.controller";
import { saleSchema } from "./sale.schema";

const router = Router();
 
router.post("/sale", validate((req, res) => saleController.createSale(req, res), saleSchema.createSale));
router.patch("/sale", validate((req, res) => saleController.updateSaleStatus(req, res), saleSchema.updateStatus));
router.patch("/sale/cancel", validate((req, res) => saleController.cancelSale(req, res), saleSchema.cancelSale));
router.get("/sale", validate((req, res) => saleController.getSales(req, res), saleSchema.getSales));
router.get("/sale/:userId", validate((req, res) => saleController.getUserSales(req, res), saleSchema.getUserSales));
router.get("/freight/check", validate((req, res) => saleController.checkFreight(req, res), saleSchema.checkFreight))

export default router;