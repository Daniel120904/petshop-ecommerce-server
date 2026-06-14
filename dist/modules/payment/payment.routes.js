"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_schema_1 = require("./payment.schema");
const payment_controller_1 = __importDefault(require("./payment.controller"));
const validate_middleware_1 = require("../../middlewares/validate.middleware");
const router = (0, express_1.Router)();
router.post("/card", (0, validate_middleware_1.validate)((req, res) => payment_controller_1.default.createCard(req, res), payment_schema_1.paymentSchema.createCard));
router.patch("/card/primary", (0, validate_middleware_1.validate)((req, res) => payment_controller_1.default.changePrimaryCard(req, res), payment_schema_1.paymentSchema.changePrimaryCard));
router.delete("/card", (0, validate_middleware_1.validate)((req, res) => payment_controller_1.default.deleteCard(req, res), payment_schema_1.paymentSchema.deleteCard));
router.get("/card", (0, validate_middleware_1.validate)((req, res) => payment_controller_1.default.getCards(req, res), payment_schema_1.paymentSchema.getCards));
exports.default = router;
