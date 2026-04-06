import { Application } from "express";
import fs from "fs";
import path from "path";
import authMiddleware from "../middlewares/auth.middleware";

export function registerRoutes(app: Application) {
    const modulesPath = path.join(__dirname, "../modules");
    
    fs.readdirSync(modulesPath).forEach(moduleName => {
        const modulePath = path.join(modulesPath, moduleName);

        if (!fs.lstatSync(modulePath).isDirectory()) return;

        const routeFile = fs
            .readdirSync(modulePath)
            .find(file => file.endsWith(".routes.js") || file.endsWith(".routes.ts"));

            if (!routeFile) return;

        const routes = require(path.join(modulePath, routeFile)).default;

        app.use(
            `/api`,
            authMiddleware.authenticate,
            authMiddleware.requirePermissions(),
            routes
        );
    });
}