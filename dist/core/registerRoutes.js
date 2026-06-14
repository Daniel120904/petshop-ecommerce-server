"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = registerRoutes;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
function registerRoutes(app) {
    const modulesPath = path_1.default.join(__dirname, "../modules");
    fs_1.default.readdirSync(modulesPath).forEach(moduleName => {
        const modulePath = path_1.default.join(modulesPath, moduleName);
        if (!fs_1.default.lstatSync(modulePath).isDirectory())
            return;
        const routeFile = fs_1.default
            .readdirSync(modulePath)
            .find(file => file.endsWith(".routes.js") || file.endsWith(".routes.ts"));
        if (!routeFile)
            return;
        const routes = require(path_1.default.join(modulePath, routeFile)).default;
        app.use(`/api`, auth_middleware_1.default.authenticate, auth_middleware_1.default.requirePermissions(), routes);
    });
}
