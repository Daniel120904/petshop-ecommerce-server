import { Router } from "express";
import phoneController from "./phone.controller";
import { phoneSchema } from "./phone.schema";
import { validate } from "../../middlewares/validate.middleware";

const router = Router();

router.post("/phone", validate((req, res) => phoneController.create(req, res), phoneSchema.create));

router.delete("/phone", validate((req, res) => phoneController.delete(req, res), phoneSchema.delete));

router.get("/phone", validate((req, res) => phoneController.get(req, res), phoneSchema.get));

export default router;