import { Router } from "express";
import { validateDto } from "../../middlewares/schema.middleware";
import authController from "./auth.controller";
import authMiddleware from "../../middlewares/auth.middleware";
import { authSchema } from "./auth.schema";


const router = Router();

router.post("/login", validateDto(authSchema.login), (req, res) => authController.login(req, res));
router.post("/register", validateDto(authSchema.register), (req, res) => authController.register(req, res));
router.post("/refresh", validateDto(authSchema.refresh), (req, res) => authController.refresh(req, res));

router.post("/logout", authMiddleware.authenticate, (req, res) => authController.logout(req, res));
router.get("/me", authMiddleware.authenticate, (req, res) => authController.me(req, res));

export default router;