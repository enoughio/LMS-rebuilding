"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = exports.authenticate = exports.verifyToken = void 0;
const express_oauth2_jwt_bearer_1 = require("express-oauth2-jwt-bearer");
const prisma_js_1 = __importDefault(require("../lib/prisma.js")); // Adjust the import path as necessary
exports.verifyToken = (0, express_oauth2_jwt_bearer_1.auth)({
    audience: "https://api.studentsapp.com",
    issuerBaseURL: "https://dev-173h8fm3s2l6fjai.us.auth0.com/",
    tokenSigningAlg: "RS256",
});
const authenticate = async (req, res, next) => {
    try {
        // Ensure the token was verified and req.auth is populated
        console.log("verifyToken middleware executed");
        if (!req.auth || !req.auth.payload.sub) {
            res.status(401).json({ error: "Unauthorized: No valid token provided" });
            return;
        }
        const auth0UserId = req.auth.payload.sub;
        // Fetch user from the database with relevant fields and relationships
        const user = await prisma_js_1.default.user.findUnique({
            where: { auth0UserId },
            select: {
                id: true,
                auth0UserId: true,
                name: true,
                email: true,
                emailVerified: true,
                varifiedBySuperAdmin: true,
                role: true,
                avatar: true,
                bio: true,
                phone: true,
                address: true,
                createdAt: true,
                updatedAt: true,
                // Include related data as needed (adjust based on your requirements)
                memberships: {
                    select: {
                        id: true,
                        startDate: true,
                        endDate: true,
                        status: true,
                        library: { select: { id: true, name: true } },
                        membershipPlan: { select: { id: true, name: true } },
                    },
                },
                registeredLibraries: {
                    select: { id: true, name: true, status: true },
                },
                adminOf: {
                    select: { id: true, name: true, status: true },
                },
                libraryStaff: {
                    select: { id: true, position: true, libraryId: true },
                },
                // Add other relationships if needed (e.g., seatBookings, bookBorrowings)
            },
        });
        if (!user) {
            res.status(404).json({ error: "User not found in database" });
            return;
        }
        // Attach user data to req.user
        req.user = {
            ...user,
            isActive: user.varifiedBySuperAdmin, // Map verifiedBySuperAdmin to isActive for requiredRoles middleware
        };
        next();
    }
    catch (error) {
        console.error("Error in authenticate middleware:", error);
        res.status(401).json({ error: "Unauthorized" });
    }
};
exports.authenticate = authenticate;
const authorizeRoles = (roles) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    message: "Unauthorized: Authentication required",
                });
                return;
            }
            if (!req.user.emailVerified) {
                res.status(403).json({
                    success: false,
                    message: "You need to verify your account to access this resource",
                });
                return;
            }
            if (!req.user.role) {
                res.status(403).json({
                    success: false,
                    message: "You do not have a role assigned to access this resource",
                });
                return;
            }
            const allowedRoles = Array.isArray(roles) ? roles : [roles];
            if (!allowedRoles.includes(req.user.role)) {
                res.status(403).json({
                    success: false,
                    message: "You do not have permission to access this resource",
                });
                return;
            }
            next();
        }
        catch (error) {
            console.error("Error in requiredRoles middleware:", error);
            res.status(403).json({ error: "Forbidden" });
        }
    };
};
exports.authorizeRoles = authorizeRoles;
//# sourceMappingURL=authMiddelware.js.map