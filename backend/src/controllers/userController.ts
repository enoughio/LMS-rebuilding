import { Request, Response } from "express";
import prisma from "../lib/prisma.js";
import { UserRole } from "../../generated/prisma/index.js";

// Define interface for basic user data from Prisma (using Prisma-generated UserRole)

interface ErrorResponse {
  error: string;
}

// Get basic user information
export const getCurrentUser = async (
  req: Request,
  res: Response
): Promise<void> => {
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
      data: user,
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

    const userInfo = await fetch(
      "https://dev-173h8fm3s2l6fjai.us.auth0.com/userinfo",
      {
        headers: {
          Authorization: `Bearer ${authReq.auth.token}`,
        },
      }
    ).then((res) => res.json());

    // console.log("Auth0 user info:", userInfo);

    const { sub, name, email, picture, email_verified } = userInfo;

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

    // Check if user already exists by auth0UserId OR email
    const existingUser = await prisma.user.findUnique({
      where: { auth0UserId: auth0UserId },
    });

    if (existingUser) {
      // Update existing user - make sure to update auth0UserId if it was null
      const updatedUser = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          auth0UserId, // Update this in case iet was null befor
          name: userName, // Update name in case it changed
          // email: userEmail, // Update email in case it changed
          avatar: userPicture,
          emailVerified: isEmailVerified,
          lastLogin: new Date(),
          updatedAt: new Date(),
        },
        select: {
          id: true,
          auth0UserId: true,
          name: true,
          email: true,
          emailVerified: true,
          varifiedBySuperAdmin: true,
          address: true,
          phone: true,
          bio: true,
          role: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      // console.log("User synced successfully by update:", updatedUser);
      res.status(200).json({
        success: true,
        message: "User synced successfully",
        data: updatedUser,
      });
      return;
    }

    // Create new user if not exists
    const user = await prisma.user.create({
      data: {
        auth0UserId,
        email: userEmail,
        name: userName,
        avatar: userPicture,
        emailVerified: isEmailVerified,
        role: UserRole.MEMBER, // Default role
        varifiedBySuperAdmin: false,
        lastLogin: new Date(),
      },
      select: {
        id: true,
        auth0UserId: true,
        name: true,
        email: true,
        emailVerified: true,
        varifiedBySuperAdmin: true,
        address: true,
        phone: true,
        bio: true,
        role: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // console.log("User synced successfully by creation:", user);
    res.status(201).json({
      success: true,
      message: "User synced successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error syncing user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
