import { Router } from "express";
import { SaleController } from "../controllers/saleController";
import { validateDto } from "../middlewares/validationsMiddleware";
import { saleValidations } from "../validations/saleValidations";

const router = Router()
const saleController = new SaleController()

router.get("/getSalesUser", (req, res) => saleController.getSalesUser(req, res))
router.get("/getCoupon", (req, res) => saleController.getCoupon(req, res))
router.get("/getSales", validateDto(saleValidations.getSales), (req, res) => saleController.getSales(req, res))
router.get("/getSalesByCategory", (req, res) => saleController.getSalesByCategory(req, res))

router.post("/createSale", validateDto(saleValidations.createSale), (req, res) => saleController.createSale(req, res))

router.put("/updateStatusSale", validateDto(saleValidations.updateStatusSale), (req, res) => saleController.updateStatusSale(req, res))

export default router
