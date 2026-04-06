import "dotenv/config";
import express, { Application } from "express";
import morgan from "morgan";

import authRoutes from "./modules/auth/auth.routes";
import authMiddleware from "./middlewares/auth.middleware";
import { PrismaClient } from "./generated/prisma";
import { startJobs } from "./jobs";
import userRoutes from "./modules/user/user.routes";
import phoneRoutes from "./modules/phone/phone.routes";
import addressRoutes from "./modules/address/address.routes";
import paymentRoutes from "./modules/payment/payment.routes";
import productRoutes from "./modules/product/product.routes";
import saleRoutes from "./modules/sale/sale.routes";


const app: Application = express();
const prisma = new PrismaClient();
const cors = require("cors");

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.use("/api",
  authMiddleware.authenticate,
  authMiddleware.requirePermissions()
);

app.use("/api", paymentRoutes);
app.use("/api", userRoutes);
app.use("/api", phoneRoutes);
app.use("/api", addressRoutes);
app.use("/api", authRoutes);
app.use("/api", productRoutes);
app.use("/api", saleRoutes);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
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
        startJobs();
    } catch (error) {
        console.error("Database connection failed:", error);
    }
});