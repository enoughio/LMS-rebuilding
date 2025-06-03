import { Request, Response } from 'express';
import prisma from '../lib/prisma.js';
import { MembershipStatus, Prisma } from '../../generated/prisma/index.js';

// Get all membership plans for a library
export const getLibraryMembershipPlans = async (req: Request, res: Response) => {
  try {
    const { libraryId } = req.params;

    const plans = await prisma.membershipPlan.findMany({
      where: {
        libraryId,
        isActive: true,
      },
      include: {
        library: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });

    res.json({ success: true, data: plans });
  } catch (error) {
    console.error('Error fetching membership plans:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// Create a new membership plan
export const createMembershipPlan = async (req: Request, res: Response) => {
  try {
    const { libraryId } = req.params;
    const {
      name,
      description,
      price,
      duration,
      features,
      allowedBookingsPerMonth,
      eLibraryAccess,
      maxBorrowedBooks,
      maxBorrowDuration,
    } = req.body;

    const plan = await prisma.membershipPlan.create({
      data: {
        name,
        description,
        price,
        duration,
        features,
        allowedBookingsPerMonth,
        eLibraryAccess,
        maxBorrowedBooks,
        maxBorrowDuration,
        library: {
          connect: { id: libraryId },
        },
      },
    });

    res.status(201).json({ success: true, data: plan });
  } catch (error) {
    console.error('Error creating membership plan:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// Update a membership plan
export const updateMembershipPlan = async (req: Request, res: Response) => {
  try {
    const { planId } = req.params;
    const updateData = req.body;

    const plan = await prisma.membershipPlan.update({
      where: { id: planId },
      data: updateData,
    });

    res.json({ success: true, data: plan });
  } catch (error) {
    console.error('Error updating membership plan:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// Delete a membership plan
export const deleteMembershipPlan = async (req: Request, res: Response) => {
  try {
    const { planId } = req.params;

    await prisma.membershipPlan.update({
      where: { id: planId },
      data: { isActive: false },
    });

    res.json({ success: true, message: 'Membership plan deleted successfully' });
  } catch (error) {
    console.error('Error deleting membership plan:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// Purchase a membership
export const purchaseMembership = async (req: Request, res: Response) => {
  try {
    const { planId, paymentDetails } = req.body;
    const userId = (req as any).user.id;

    // Start a transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Get the plan details
      const plan = await prisma.membershipPlan.findUnique({
        where: { id: planId },
      });

      if (!plan) {
        throw new Error('Membership plan not found');
      }

      // Calculate dates
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + plan.duration);

      // Create membership
      const membership = await prisma.membership.create({
        data: {
          startDate,
          endDate,
          status: MembershipStatus.ACTIVE,
          user: { connect: { id: userId } },
          library: { connect: { id: plan.libraryId } },
          membershipPlan: { connect: { id: planId } },
        },
      });

      // Create payment record
      const payment = await prisma.payment.create({
        data: {
          amount: plan.price,
          status: 'COMPLETED',
          type: 'MEMBERSHIP',
          membership: { connect: { id: membership.id } },
          user: { connect: { id: userId } },
          ...paymentDetails,
        },
      });

      return { membership, payment };
    });

    res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.error('Error purchasing membership:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// Get user's memberships
export const getUserMemberships = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const memberships = await prisma.membership.findMany({
      where: {
        userId,
      },
      include: {
        library: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
        membershipPlan: true,
      },
    });

    res.json({ success: true, data: memberships });
  } catch (error) {
    console.error('Error fetching user memberships:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// Cancel membership
export const cancelMembership = async (req: Request, res: Response) => {
  try {
    const { membershipId } = req.params;
    const userId = (req as any).user.id;

    const membership = await prisma.membership.update({
      where: {
        id: membershipId,
        userId, // Ensure the membership belongs to the user
      },
      data: {
        status: MembershipStatus.CANCELLED,
      },
    });

    res.json({ success: true, data: membership });
  } catch (error) {
    console.error('Error cancelling membership:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// Renew membership
export const renewMembership = async (req: Request, res: Response) => {
  try {
    const { membershipId } = req.params;
    const userId = (req as any).user.id;

    const membership = await prisma.membership.findUnique({
      where: {
        id: membershipId,
        userId,
      },
      include: {
        membershipPlan: true,
      },
    });

    if (!membership) {
      return res.status(404).json({ success: false, error: 'Membership not found' });
    }

    const newEndDate = new Date(membership.endDate);
    newEndDate.setDate(newEndDate.getDate() + membership.membershipPlan.duration);

    const updatedMembership = await prisma.membership.update({
      where: {
        id: membershipId,
      },
      data: {
        endDate: newEndDate,
        status: MembershipStatus.ACTIVE,
      },
    });

    res.json({ success: true, data: updatedMembership });
  } catch (error) {
    console.error('Error renewing membership:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}; 