"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_js_1 = require("../controllers/userController.js");
const authMiddelware_js_1 = require("../middelware/authMiddelware.js");
const router = express_1.default.Router();
// Import user controller functions
router.get('/me', authMiddelware_js_1.verifyToken, userController_js_1.getCurrentUser);
router.post("/sync-user", authMiddelware_js_1.verifyToken, userController_js_1.syncUser);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map