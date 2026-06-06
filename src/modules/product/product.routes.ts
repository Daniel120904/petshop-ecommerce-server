import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware";
import { productSchema } from "./product.schema";
import productController from "./product.controller";

const router = Router();

router.get("/product", validate((req, res) => productController.getProducts(req, res), productSchema.listProduct));
router.get("/product/:productId", validate((req, res) => productController.getProduct(req, res), productSchema.getProduct));
router.post("/product", validate((req, res) => productController.createProduct(req, res), productSchema.createProduct));
router.patch("/product/active", validate((req, res) => productController.activeProduct(req, res), productSchema.activeProduct));
router.delete("/product", validate((req, res) => productController.deleteProduct(req, res), productSchema.deleteProduct));
router.put("/product", validate((req, res) => productController.editProduct(req, res), productSchema.editProduct));

router.get("/cart", validate((req, res) => productController.getCart(req, res)));
router.post("/cart", validate((req, res) => productController.addCart(req, res), productSchema.addCart));
router.delete("/cart", validate((req, res) => productController.removeCart(req, res), productSchema.removeCart));
router.put("/cart", validate((req, res) => productController.updateCart(req, res), productSchema.updateCart));

router.get("/subCategory", validate((req, res) => productController.getSubCategories(req, res), productSchema.getSubCategories));
router.get("/category", validate((req, res) => productController.getCategories(req, res)));

router.post("/chatBot", validate((req, res) => productController.chatBot(req, res), productSchema.chatBotReq))

export default router;