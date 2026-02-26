import { Router } from "express";
import authController from "../core/auth/auth.controller";
import authMiddleware from "../core/auth/auth.middleware";
import { validateDto } from "../middlewares/validationsMiddleware";
import { authValidations } from "../validations/authValidations";

const router = Router();

router.post("/login", validateDto(authValidations.login), (req, res) => authController.login(req, res));
router.post("/register", validateDto(authValidations.register), (req, res) => authController.register(req, res));
router.post("/refresh", validateDto(authValidations.refresh), (req, res) => authController.refresh(req, res));

router.post("/logout", authMiddleware.authenticate, (req, res) => authController.logout(req, res));
router.get("/me", authMiddleware.authenticate, (req, res) => authController.me(req, res));

export default router;