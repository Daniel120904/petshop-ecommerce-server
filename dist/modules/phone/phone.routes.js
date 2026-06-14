"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const phone_controller_1 = __importDefault(require("./phone.controller"));
const phone_schema_1 = require("./phone.schema");
const validate_middleware_1 = require("../../middlewares/validate.middleware");
const router = (0, express_1.Router)();
router.post("/phone", (0, validate_middleware_1.validate)((req, res) => phone_controller_1.default.create(req, res), phone_schema_1.phoneSchema.create));
router.delete("/phone", (0, validate_middleware_1.validate)((req, res) => phone_controller_1.default.delete(req, res), phone_schema_1.phoneSchema.delete));
router.get("/phone", (0, validate_middleware_1.validate)((req, res) => phone_controller_1.default.get(req, res), phone_schema_1.phoneSchema.get));
exports.default = router;
