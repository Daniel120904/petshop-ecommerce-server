"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validate_middleware_1 = require("../../middlewares/validate.middleware");
const sale_controller_1 = __importDefault(require("./sale.controller"));
const sale_schema_1 = require("./sale.schema");
const router = (0, express_1.Router)();
router.post("/sale", (0, validate_middleware_1.validate)((req, res) => sale_controller_1.default.createSale(req, res), sale_schema_1.saleSchema.createSale));
router.patch("/sale", (0, validate_middleware_1.validate)((req, res) => sale_controller_1.default.updateSaleStatus(req, res), sale_schema_1.saleSchema.updateStatus));
router.patch("/sale/cancel", (0, validate_middleware_1.validate)((req, res) => sale_controller_1.default.cancelSale(req, res), sale_schema_1.saleSchema.cancelSale));
router.get("/sale", (0, validate_middleware_1.validate)((req, res) => sale_controller_1.default.getSales(req, res), sale_schema_1.saleSchema.getSales));
router.get("/sale/:userId", (0, validate_middleware_1.validate)((req, res) => sale_controller_1.default.getUserSales(req, res), sale_schema_1.saleSchema.getUserSales));
exports.default = router;
