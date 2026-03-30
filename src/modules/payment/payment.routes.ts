import { Router } from "express";
import { paymentSchema } from "./payment.schema";
import paymentController from "./payment.controller";
import { validate } from "../../middlewares/validate.middleware";

const router = Router();
router.post("/card", validate((req, res) => paymentController.createCard(req, res), paymentSchema.createCard));
router.patch("/card/primary", validate((req, res) => paymentController.changePrimaryCard(req, res), paymentSchema.changePrimaryCard));
router.delete("/card", validate((req, res) => paymentController.deleteCard(req, res), paymentSchema.deleteCard));
router.get("/card", validate((req, res) => paymentController.getCards(req, res), paymentSchema.getCards));

export default router;