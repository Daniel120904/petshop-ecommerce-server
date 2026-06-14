"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const client_1 = require("@prisma/client");
const jobs_1 = require("./jobs");
const registerRoutes_1 = require("./core/registerRoutes");
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
const cors = require("cors");
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
app.use(cors());
(0, registerRoutes_1.registerRoutes)(app);
app.use((err, req, res, next) => {
    console.error(`[${req.method} ${req.path}]`, err);
    res.status(err.status || 500).json({
        message: err.message || "Internal Server Error",
    });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`Server running on http://localhost:${PORT}`);
    try {
        await prisma.$connect();
        console.log("Database connected");
        (0, jobs_1.startJobs)();
    }
    catch (error) {
        console.error("Database connection failed:", error);
    }
});
