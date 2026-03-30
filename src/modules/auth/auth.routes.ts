import { Router } from "express";
import authController from "./auth.controller";
import { authSchema } from "./auth.schema";
import { validate } from "../../middlewares/validate.middleware";


const router = Router();

router.post("/login", validate((req, res) => authController.login(req, res), authSchema.login));
router.post("/register", validate((req, res) => authController.register(req, res), authSchema.register));
router.post("/refresh", validate((req, res) => authController.refresh(req, res), authSchema.refresh));
router.post("/logout", validate((req, res) => authController.logout(req, res), authSchema.logout));

router.patch("/password", validate((req, res) => authController.updatePassword(req, res), authSchema.updatePassword));
router.patch("/user/blocked", validate((req, res) => authController.blockUser(req, res), authSchema.blockUser));
router.patch("/user/active", validate((req, res) => authController.activeUser(req, res), authSchema.activeUser));

router.put("/user", validate((req, res) => authController.updateUser(req, res), authSchema.updateUser));

router.get("/me", (req, res) => authController.me(req, res));

export default router;