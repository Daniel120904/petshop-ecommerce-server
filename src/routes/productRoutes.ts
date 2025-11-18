import { Router } from "express";
import { UserController } from "../controllers/userController";
import { validateDto } from "../middlewares/validationsMiddleware";
import { ProductController } from "../controllers/productController";
import { productValidations } from "../validations/productValidations";


const router = Router()
const productController = new ProductController()

router.get("/getProducts", (req, res) => productController.getProducts(req, res))
router.get("/getCartItems", (req, res) => productController.getCartItems(req, res))
router.get("/getCategories", (req, res) => productController.getCategories(req, res))

router.post("/getAiRecommendation", validateDto(productValidations.getAiRecommendation), (req, res) => productController.getAiRecommendation(req, res))

router.put("/updateCartItens", validateDto(productValidations.updateCartItens), (req, res) => productController.updateCartItens(req, res))

export default router