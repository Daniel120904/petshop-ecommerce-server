"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validate_middleware_1 = require("../../middlewares/validate.middleware");
const coupon_controller_1 = __importDefault(require("./coupon.controller"));
const coupon_schema_1 = require("./coupon.schema");
const router = (0, express_1.Router)();
router.post("/coupon", (0, validate_middleware_1.validate)((req, res) => coupon_controller_1.default.create(req, res), coupon_schema_1.couponSchema.create));
router.get("/coupon", (0, validate_middleware_1.validate)((req, res) => coupon_controller_1.default.getCoupons(req, res), coupon_schema_1.couponSchema.list));
router.get("/coupon/check", (0, validate_middleware_1.validate)((req, res) => coupon_controller_1.default.check(req, res), coupon_schema_1.couponSchema.check));
router.put("/coupon", (0, validate_middleware_1.validate)((req, res) => coupon_controller_1.default.update(req, res), coupon_schema_1.couponSchema.update));
router.patch("/coupon/active", (0, validate_middleware_1.validate)((req, res) => coupon_controller_1.default.active(req, res), coupon_schema_1.couponSchema.active));
exports.default = router;
