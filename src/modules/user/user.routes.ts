import { Router } from "express";
import { userSchema } from "./user.schema";
import userController from "./user.controller";
import { validate } from "../../middlewares/validate.middleware";

const router = Router();

router.get("/user", validate((req, res) => userController.getUsers(req, res), userSchema.list));
router.get("/user/:userId", validate((req, res) => userController.getUser(req, res), userSchema.get));

router.delete("/user/me", (req, res) => userController.deleteMe(req, res));
router.delete("/user/:userId", validate((req, res) => userController.delete(req, res), userSchema.delete));

export default router; 