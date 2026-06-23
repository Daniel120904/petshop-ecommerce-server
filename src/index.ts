import express, { Application } from "express";
import morgan from "morgan";

import { PrismaClient } from '@prisma/client';
import { startJobs } from "./jobs";
import { registerRoutes } from "./core/registerRoutes";


const app: Application = express();
const prisma = new PrismaClient();
const cors = require("cors");

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

registerRoutes(app);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(`[${req.method} ${req.path}]`, err);
  res.status(err.status || 500).json({
    message: err || "Internal Server Error",
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
