import "dotenv/config";
import express, { Application } from "express";
import morgan from "morgan";
import { PrismaClient } from "../generated/prisma"; 

import userRoutes from "./routes/userRoutes";

const app: Application = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(morgan("dev"));

app.use("/api", userRoutes);

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
  } catch (error) {
    console.error("Database connection failed:", error);
  }
});
