import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware";
import couponController from "./coupon.controller";
import { couponSchema } from "./coupon.schema";

const router = Router();

router.post("/coupon", validate((req, res) => couponController.create(req, res), couponSchema.create));
router.get("/coupon", validate((req, res) => couponController.getCoupons(req, res), couponSchema.list));
router.get("/coupon/check", validate((req, res) => couponController.check(req, res), couponSchema.check));
router.put("/coupon", validate((req, res) => couponController.update(req, res), couponSchema.update));
router.patch("/coupon/active", validate((req, res) => couponController.active(req, res), couponSchema.active));

export default router;