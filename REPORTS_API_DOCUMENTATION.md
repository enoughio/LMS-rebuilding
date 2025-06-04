# Reports API Documentation

## Overview
This document describes the reports API endpoints that have been implemented for the LMS (Library Management System) super admin dashboard.

## Architecture
- **Backend**: Node.js/Express controllers in `backend/src/controllers/reportsController.ts`
- **Frontend API Routes**: Next.js API routes in `frontend/app/api/reports/`
- **Client Service**: TypeScript service in `frontend/lib/reports-api.ts`
- **UI Component**: React page in `frontend/app/dashboard/super_admin/reports/page.tsx`

## Backend Endpoints (Node.js)
All endpoints require SUPER_ADMIN authentication.

### 1. GET /api/reports/overview
- **Description**: Get comprehensive reports overview with key metrics
- **Query Parameters**: 
  - `libraryId` (optional): Filter by specific library
- **Response**: Monthly revenue, bookings, active users, new users, top libraries

### 2. GET /api/reports/revenue
- **Description**: Get detailed revenue reports with monthly breakdown
- **Query Parameters**:
  - `startDate` (optional): Start date (ISO string)
  - `endDate` (optional): End date (ISO string) 
  - `libraryId` (optional): Filter by specific library
- **Response**: Monthly revenue data, revenue breakdown by type, total revenue

### 3. GET /api/reports/users
- **Description**: Get user activity and growth reports
- **Query Parameters**:
  - `startDate` (optional): Start date (ISO string)
  - `endDate` (optional): End date (ISO string)
  - `libraryId` (optional): Filter by specific library
- **Response**: Daily user activity, user growth summary

### 4. GET /api/reports/libraries
- **Description**: Get library performance reports
- **Query Parameters**:
  - `startDate` (optional): Start date (ISO string)
  - `endDate` (optional): End date (ISO string)
  - `libraryId` (optional): Filter by specific library
- **Response**: Library performance metrics, occupancy rates, revenue per library

### 5. GET /api/reports/bookings
- **Description**: Get booking analytics and trends
- **Query Parameters**:
  - `startDate` (optional): Start date (ISO string)
  - `endDate` (optional): End date (ISO string)
  - `libraryId` (optional): Filter by specific library
- **Response**: Daily booking trends, booking statistics by seat type, popular time slots

### 6. GET /api/reports/libraries-list
- **Description**: Get list of all libraries for filter dropdown
- **Response**: Array of libraries with id, name, city, state

## Frontend API Routes (Next.js)
These routes proxy requests to the backend with authentication:

- `/api/reports/overview`
- `/api/reports/revenue`
- `/api/reports/users`
- `/api/reports/libraries`
- `/api/reports/bookings`
- `/api/reports/libraries-list`

Each route:
1. Validates user authentication using Auth0
2. Forwards requests to the Node.js backend
3. Includes Bearer token for authorization
4. Returns formatted responses

## Client Service (TypeScript)
The `reportsApi` service provides typed methods:

```typescript
import { reportsApi } from '@/lib/reports-api';

// Get overview data
const overview = await reportsApi.getReportsOverview({ libraryId: 'lib-123' });

// Get revenue reports with date range
const revenue = await reportsApi.getRevenueReports({
  startDate: '2024-01-01',
  endDate: '2024-12-31',
  libraryId: 'all'
});
```

## UI Features
The reports page includes:

1. **Filter Controls**:
   - Date range picker
   - Library filter dropdown
   - Report type selector

2. **Overview Tab**:
   - Key metrics cards (revenue, bookings, users)
   - Revenue chart visualization
   - Top performing libraries list

3. **Revenue Tab**:
   - Revenue breakdown by payment type
   - Monthly revenue chart
   - Total revenue calculations

4. **Users Tab**:
   - User activity summary
   - Daily activity breakdown
   - Growth metrics

5. **Libraries Tab**:
   - Library performance comparison
   - Occupancy rates
   - Revenue per library

## Data Flow
1. User selects filters in the UI
2. React component calls `reportsApi` methods
3. Service makes requests to Next.js API routes
4. Next.js routes forward to Node.js backend
5. Backend queries Prisma/MongoDB
6. Data flows back through the chain
7. UI updates with real-time data

## Environment Variables
Required in `frontend/.env.local`:
```
NODE_BACKEND_URL=http://localhost:5000
```

## Database Schema Dependencies
The reports use these Prisma models:
- `User` (for member counts and activity)
- `Library` (for library data and performance)
- `Payment` (for revenue calculations)
- `SeatBooking` (for booking analytics)
- `Membership` (for membership revenue)

## Authentication
All endpoints require:
- Valid Auth0 session
- SUPER_ADMIN role
- Bearer token authorization

## Error Handling
- API routes return standardized error responses
- Client service includes error handling and logging
- UI displays loading states and error messages

This implementation provides a complete, type-safe, and authenticated reports system for the LMS platform.
