"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const libraryController = __importStar(require("../controllers/libraryController.js"));
const authMiddelware_js_1 = require("../middelware/authMiddelware.js");
const index_js_1 = require("../../generated/prisma/index.js");
// import { UserRole } from '../../generated/prisma/index.js';
// import { authenticate, authorizeRoles } from '../middleware/authMiddelware.js';
// import { authenticate,  authorizeRoles } from '../middleware/authMiddelware.js';
// import { ALL_PERMISSIONS } from '../utils/permissions';
const router = express_1.default.Router();
// // Public routes for library listings
router.get('/', libraryController.getAllLibraries); // Anyone can view approved libraries
// router.get('/featured', libraryController.getFeaturedLibraries); // Get featured libraries for homepage
// router.get('/search', libraryController.searchLibraries); // Search libraries by name, location, etc.
// router.get('/nearby', libraryController.getNearbyLibraries); // Get libraries near user's location
// // Individual library detail routes
router.get('/:id', libraryController.getLibraryById); // View a specific library
// router.get('/:id/books', libraryController.getLibraryBooks); // View books in a specific library
// router.get('/:id/events', libraryController.getLibraryEvents); // View upcoming events at a library
// router.get('/:id/membership-plans', libraryController.getLibraryMembershipPlans); // Get membership plans
// // router.get('/:id/seats', libraryController.getLibrarySeats); // Get available seats info
// // router.get('/:id/', libraryController.getLibraryReviews); // Get reviews for a specific library
// // Protected routes
router.post('/register', authMiddelware_js_1.verifyToken, authMiddelware_js_1.authenticate, (0, authMiddelware_js_1.authorizeRoles)(index_js_1.UserRole.MEMBER), libraryController.registerLibrary);
// router.get('/admin/dashboard', authenticate, authorizeRoles(UserRole.ADMIN), libraryController.getAdminDashboard);
// router.post('/:libraryId/updateseats', authenticate, authorizeRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN), libraryController.updateLibrarySeats);
// //some more routes
// // Admin library management routes (protected)
// router.put('/:id', authenticate, authorizeRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN), libraryController.updateLibrary);
// router.post('/:id/books', authenticate, authorizeRoles(UserRole.ADMIN), libraryController.addBook);
// router.get('/:id/members', authenticate, authorizeRoles(UserRole.ADMIN), libraryController.getLibraryMembers);
// // Super Admin routes
// router.get('/admin/requests', authenticate, authorizeRoles(UserRole.SUPER_ADMIN), libraryController.getLibraryRequests);
// router.get('/admin/requests/:id', authenticate, authorizeRoles(UserRole.SUPER_ADMIN), libraryController.getLibraryRequestById);
// router.patch('/:id/approve', authenticate, authorizeRoles(UserRole.SUPER_ADMIN), libraryController.approveLibrary);
// router.patch('/:id/reject', authenticate, authorizeRoles(UserRole.SUPER_ADMIN), libraryController.rejectLibrary);
// router.delete('/:id', authenticate, authorizeRoles(UserRole.SUPER_ADMIN), libraryController.deleteLibrary);
exports.default = router;
//# sourceMappingURL=libraryRoutes.js.map