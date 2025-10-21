import { Router } from "express";
import { SaleController } from "../controllers/saleController";
import { validateDto } from "../middlewares/validationsMiddleware";

const router = Router()
const saleController = new SaleController()

router.get("/getSalesUser", (req, res) => saleController.getSalesUser(req, res))
router.get("/getCoupon", (req, res) => saleController.getCoupon(req, res))

router.post("/createSale", (req, res) => saleController.createSale(req, res))

export default router
