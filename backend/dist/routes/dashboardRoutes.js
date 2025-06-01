"use strict";
// routes/dashboardRoutes.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dashboardController_js_1 = require("../controllers/dashboardController.js");
const authMiddelware_js_1 = require("../middelware/authMiddelware.js");
const router = express_1.default.Router();
/**
 * GET /api/dashboard/member
 * Member dashboard route (Only accessible by authenticated users with MEMBER role)
 */
router.get('/super-admin', authMiddelware_js_1.verifyToken, authMiddelware_js_1.authenticate, dashboardController_js_1.getSuperAdminDashboard);
router.get('/admin', authMiddelware_js_1.verifyToken, authMiddelware_js_1.authenticate, dashboardController_js_1.getAdminDashboard);
router.get('/member', authMiddelware_js_1.verifyToken, authMiddelware_js_1.authenticate, dashboardController_js_1.getMemberDashboard);
exports.default = router;
//# sourceMappingURL=dashboardRoutes.js.map