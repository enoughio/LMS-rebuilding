import { Request, Response } from "express";
import prisma from "../lib/prisma.js"; 
import { $Enums} from "../../generated/prisma/index.js";

// Define interface for basic user data from Prisma (using Prisma-generated UserRole)


interface ErrorResponse {
  error: string;
}


// Get basic user information
export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // Type assertion for req to include auth property (from express-oauth2-jwt-bearer)
    const authReq = req as any;
    
    if (!authReq.auth || !authReq.auth.payload || !authReq.auth.payload.sub) {
      res.status(401).json({ error: "Unauthorized" } as ErrorResponse);
      return;
    }

    const auth0UserId: string = authReq.auth.payload.sub;

    // Fetch basic user data
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
      },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" } as ErrorResponse);
      return;
    }

    res.json({
        succsess: true,
        message: "User fetched successfully", 
        data : user 
    });


  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" } as ErrorResponse);
  }
};

// Sync user after login
export const syncUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // Type assertion for req to include auth property (from express-oauth2-jwt-bearer)
    const authReq = req as any;
    
    if (!authReq.auth || !authReq.auth.payload || !authReq.auth.payload.sub) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { sub, email, name, picture, email_verified } = authReq.auth.payload;

    // Validate required fields
    if (!sub || !email || !name) {
      res.status(400).json({ error: "Missing required Auth0 fields" });
      return;
    }

    // Ensure types are correct
    const auth0UserId = String(sub);
    const userEmail = String(email);
    const userName = String(name);
    const userPicture = picture ? String(picture) : null;
    const isEmailVerified = Boolean(email_verified);

    // Upsert user in the database
    const user = await prisma.user.upsert({
      where: { auth0UserId },
      update: {
        email: userEmail,
        name: userName,
        avatar: userPicture,
        emailVerified: isEmailVerified ? new Date() : null,
        updatedAt: new Date(),
      },
      create: {
        auth0UserId,
        email: userEmail,
        name: userName,
        avatar: userPicture,
        emailVerified: isEmailVerified ? new Date() : null,
        role: "MEMBER" as $Enums.UserRole, // Default role
        varifiedBySuperAdmin: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      select: {
        id: true,
        auth0UserId: true,
        name: true,
        email: true,
        emailVerified: true,
        varifiedBySuperAdmin: true,
        role: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json({ user });
  } catch (error) {
    console.error("Error syncing user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Mount routes


