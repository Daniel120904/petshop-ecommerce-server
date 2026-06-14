"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const address_schema_1 = require("./address.schema");
const address_controller_1 = __importDefault(require("./address.controller"));
const validate_middleware_1 = require("../../middlewares/validate.middleware");
const router = (0, express_1.Router)();
router.post("/address", (0, validate_middleware_1.validate)((req, res) => address_controller_1.default.create(req, res), address_schema_1.addressSchema.create));
router.delete("/address", (0, validate_middleware_1.validate)((req, res) => address_controller_1.default.delete(req, res), address_schema_1.addressSchema.delete));
router.put("/address", (0, validate_middleware_1.validate)((req, res) => address_controller_1.default.edit(req, res), address_schema_1.addressSchema.edit));
router.get("/address", (0, validate_middleware_1.validate)((req, res) => address_controller_1.default.get(req, res), address_schema_1.addressSchema.get));
exports.default = router;
