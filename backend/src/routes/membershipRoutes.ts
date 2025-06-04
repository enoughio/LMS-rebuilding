import express from 'express';
import { authenticate, authorizeRoles } from '../middelware/authMiddelware.js';
import { UserRole } from '../../generated/prisma/index.js';
import {
  getLibraryMembershipPlans,
  createMembershipPlan,
  updateMembershipPlan,
  deleteMembershipPlan,
  purchaseMembership,
  getUserMemberships,
  cancelMembership,
  renewMembership,
} from '../controllers/membershipController.js';

const router = express.Router();

// Middleware to authenticate all membership routes
router.use(authenticate);

// Get all membership plans for a library
router.get('/library/:libraryId/plans', getLibraryMembershipPlans);

// Create a new membership plan (Admin only)
router.post(
  '/library/:libraryId/plans',
  authorizeRoles([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  createMembershipPlan
);

// Update a membership plan (Admin only)
router.put(
  '/plans/:planId',
  authorizeRoles([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  updateMembershipPlan
);

// Delete a membership plan (Admin only)
router.delete(
  '/plans/:planId',
  authorizeRoles([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  deleteMembershipPlan
);

// Purchase a membership
router.post('/purchase', purchaseMembership);

// Get user's memberships
router.get('/my-memberships', getUserMemberships);

// Cancel membership
router.post('/cancel/:membershipId', cancelMembership);

// Renew membership
router.post('/renew/:membershipId', renewMembership);

export default router; 