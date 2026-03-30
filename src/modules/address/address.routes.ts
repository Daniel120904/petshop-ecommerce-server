import { Router } from "express";
import { addressSchema } from "./address.schema";
import addressController from "./address.controller";
import { validate } from "../../middlewares/validate.middleware";

const router = Router();

router.post("/address", validate((req, res) => addressController.create(req, res), addressSchema.create));
router.delete("/address", validate((req, res) => addressController.delete(req, res), addressSchema.delete));
router.put("/address", validate((req, res) => addressController.edit(req, res), addressSchema.edit));
router.get("/address", validate((req, res) => addressController.get(req, res), addressSchema.get));

export default router;