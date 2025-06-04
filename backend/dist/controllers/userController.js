import prisma from "../lib/prisma.js";
import { UserRole } from "../../generated/prisma/index.js";
// Get basic user information
export const getCurrentUser = async (req, res) => {
    try {
        // Type assertion for req to include auth property (from express-oauth2-jwt-bearer)
        const authReq = req;
        if (!authReq.auth || !authReq.auth.payload || !authReq.auth.payload.sub) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const auth0UserId = authReq.auth.payload.sub;
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
            res.status(404).json({ error: "User not found" });
            return;
        }
        res.json({
            succsess: true,
            message: "User fetched successfully",
            data: user,
        });
    }
    catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
// Sync user after login
export const syncUser = async (req, res) => {
    try {
        // Type assertion for req to include auth property (from express-oauth2-jwt-bearer)
        const authReq = req;
        if (!authReq.auth || !authReq.auth.payload || !authReq.auth.payload.sub) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const userInfo = await fetch("https://dev-173h8fm3s2l6fjai.us.auth0.com/userinfo", {
            headers: {
                Authorization: `Bearer ${authReq.auth.token}`,
            },
        }).then((res) => res.json());
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
    }
    catch (error) {
        console.error("Error syncing user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
export const getAllUsers = async (req, res) => {
    try {
        // Extract query parameters for filtering
        const { search, role, page = 1, limit = 10 } = req.query;
        // Build where clause for filtering
        const whereClause = {};
        // Add role filter
        if (role && role !== 'all') {
            whereClause.role = role;
        }
        // Add search filter (search in name and email)
        if (search && typeof search === 'string') {
            whereClause.OR = [
                {
                    name: {
                        contains: search,
                        mode: 'insensitive'
                    }
                },
                {
                    email: {
                        contains: search,
                        mode: 'insensitive'
                    }
                }
            ];
        }
        // Calculate pagination
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        const skip = (pageNumber - 1) * limitNumber;
        // Get total count for pagination
        const totalUsers = await prisma.user.count({
            where: whereClause
        });
        const users = await prisma.user.findMany({
            where: whereClause,
            select: {
                id: true,
                name: true,
                role: true,
                email: true,
                avatar: true,
                createdAt: true,
                memberships: {
                    select: {
                        id: true,
                        status: true,
                        startDate: true,
                        endDate: true,
                        membershipPlan: {
                            select: {
                                id: true,
                                name: true,
                            }
                        }
                    },
                    where: {
                        status: {
                            in: ['ACTIVE', 'EXPIRED', 'FREEZE']
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: 1 // Get the most recent membership
                },
                adminOf: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            skip: skip,
            take: limitNumber
        });
        // Transform the data to match your desired format
        const transformedUsers = users.map(user => {
            const baseUser = {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar || "/placeholder.svg?height=40&width=40",
                createdAt: user.createdAt.toISOString(),
            };
            // Add membership data for MEMBER role
            if (user.role === 'MEMBER' && user.memberships.length > 0) {
                const membership = user.memberships[0];
                return {
                    ...baseUser,
                    membership: {
                        planId: membership.membershipPlan.id,
                        planName: membership.membershipPlan.name,
                        status: membership.status.toLowerCase(),
                        expiresAt: membership.endDate.toISOString(),
                    }
                };
            }
            // Add library data for ADMIN role
            if (user.role === 'ADMIN' && user.adminOf) {
                return {
                    ...baseUser,
                    libraryId: user.adminOf.id,
                    libraryName: user.adminOf.name,
                };
            } // Return base user for SUPER_ADMIN or users without memberships/libraries
            return baseUser;
        });
        res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            data: transformedUsers,
            pagination: {
                currentPage: pageNumber,
                totalPages: Math.ceil(totalUsers / limitNumber),
                totalUsers: totalUsers,
                limit: limitNumber,
                hasNextPage: pageNumber * limitNumber < totalUsers,
                hasPrevPage: pageNumber > 1
            },
            filters: {
                role: role || 'all',
                search: search || ''
            }
        });
    }
    catch (error) {
        console.error("Error fetching all users:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
//# sourceMappingURL=userController.js.map