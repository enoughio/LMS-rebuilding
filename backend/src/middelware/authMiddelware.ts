import { NextFunction, Response } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import prisma  from "../lib/prisma.js"; // Adjust the import path as necessary
import { UserRole } from "../../generated/prisma/index.js"; 

export const verifyToken = auth({
  audience: "https://api.studentsapp.com",
  issuerBaseURL: "https://dev-173h8fm3s2l6fjai.us.auth0.com/",
  tokenSigningAlg: "RS256",
});

export const authenticate = async (req: any, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Ensure the token was verified and req.auth is populated
    if (!req.auth || !req.auth.payload.sub) {
      res.status(401).json({ error: "Unauthorized: No valid token provided" });
      return;
    }

    const auth0UserId = req.auth.payload.sub;

    // Fetch user from the database with relevant fields and relationships
    const user = await prisma.user.findUnique({
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
  } catch (error) {
    console.error("Error in authenticate middleware:", error);
    res.status(401).json({ error: "Unauthorized" });
  }
};

export const authorizeRoles = (roles: UserRole | UserRole[]) => {
  return (req: any, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: "Unauthorized: Authentication required",
        });
        return;
      }

      if (!req.user.isActive) {
        res.status(403).json({
          success: false,
          message: "You need to activate your account to access this resource",
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
    } catch (error) {
      console.error("Error in requiredRoles middleware:", error);
      res.status(403).json({ error: "Forbidden" });
    }
  };
};

