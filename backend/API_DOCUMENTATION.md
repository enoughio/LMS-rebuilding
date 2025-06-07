# LMS Backend API Documentation

This document provides a comprehensive overview of the backend API endpoints for the Library Management System (LMS). It includes detailed information about authentication, request/response formats, error handling, and frontend integration examples using Auth0.

## Authentication Overview

This API uses **Auth0 JWT Access Tokens** for authentication. All protected endpoints require a valid Bearer token in the Authorization header.

### Auth0 Integration
- **Provider:** Auth0 (dev-173h8fm3s2l6fjai.us.auth0.com)
- **Token Type:** JWT Access Token
- **Header Format:** `Authorization: Bearer <access_token>`

### Frontend Usage Example
```typescript
// Using fetch with Auth0 token
const { getAccessTokenSilently } = useAuth0();

const callAPI = async () => {
  try {
    const token = await getAccessTokenSilently();
    const response = await fetch('/api/user/me', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
  } catch (error) {
    console.error('API call failed:', error);
  }
};
```

---

## Table of Contents
- [Authentication](#authentication-overview)
- [User APIs](#user-apis)
- [Forum APIs](#forum-apis)
- [Library APIs](#library-apis)
- [Seat Booking APIs](#seat-booking-apis)
- [Membership APIs](#membership-apis)
- [Dashboard APIs](#dashboard-apis)
- [Reports APIs](#reports-apis)
- [Error Handling](#error-handling)
- [Data Models](#data-models)

---

## User APIs

The User APIs handle user authentication, profile management, and user administration. All user data is synchronized with Auth0 for seamless authentication.

### 1. Get Current User Profile
- **Endpoint:** `GET /api/user/me`
- **Auth:** Bearer Token (Auth0 Access Token) - Required
- **Description:** Retrieves the authenticated user's complete profile information
- **Use Case:** Display user profile, check user permissions, get user preferences

**Frontend Example:**
```typescript
// In a React component
const { getAccessTokenSilently } = useAuth0();

const fetchUserProfile = async () => {
  const token = await getAccessTokenSilently();
  const response = await fetch('/api/user/me', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "User fetched successfully",
  "data": {
    "id": "64a7b8c9d0e1f2g3h4i5j6k7",
    "auth0UserId": "auth0|64a7b8c9d0e1f2g3h4i5j6k7",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "emailVerified": true,
    "varifiedBySuperAdmin": false,
    "role": "MEMBER",
    "avatar": "https://example.com/avatar.jpg",
    "bio": "Software developer and avid reader",
    "phone": "+1234567890",
    "address": "123 Main St, City, State",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-16T14:45:00.000Z"
  }
}
```

**Error Responses:**
- `401`: Unauthorized (Invalid or missing token)
- `404`: User not found
- `500`: Internal server error

---

### 2. Sync User (Login/Registration)
- **Endpoint:** `POST /api/user/sync-user`
- **Auth:** Bearer Token (Auth0 Access Token) - Required
- **Description:** Synchronizes user data from Auth0 after login/signup. Creates new user if doesn't exist, updates existing user otherwise.
- **Use Case:** Called automatically after Auth0 login to ensure user exists in database

**Frontend Example:**
```typescript
// In Auth0 callback or after login
const { getAccessTokenSilently } = useAuth0();

const syncUser = async () => {
  const token = await getAccessTokenSilently();
  const response = await fetch('/api/user/sync-user', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};
```

**Success Response (200/201):**
```json
{
  "success": true,
  "message": "User synced successfully",
  "data": {
    "id": "64a7b8c9d0e1f2g3h4i5j6k7",
    "auth0UserId": "auth0|64a7b8c9d0e1f2g3h4i5j6k7",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "MEMBER",
    "emailVerified": true,
    "varifiedBySuperAdmin": false,
    "avatar": "https://example.com/avatar.jpg",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-16T14:45:00.000Z"
  }
}
```

---

### 3. Get All Users (Super Admin Only)
- **Endpoint:** `GET /api/user/all`
- **Auth:** Bearer Token (Super Admin Role Required)
- **Query Parameters:**
  - `search` (optional): Search by name or email
  - `role` (optional): Filter by user role (MEMBER, ADMIN, SUPER_ADMIN)
  - `page` (optional): Page number for pagination (default: 1)
  - `limit` (optional): Items per page (default: 10, max: 100)
- **Description:** Returns paginated list of all users with advanced filtering options

**Frontend Example:**
```typescript
const fetchAllUsers = async (filters = {}) => {
  const token = await getAccessTokenSilently();
  const queryParams = new URLSearchParams(filters);
  const response = await fetch(`/api/user/all?${queryParams}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};

// Usage
const users = await fetchAllUsers({
  search: 'john',
  role: 'MEMBER',
  page: '1',
  limit: '20'
});
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Users fetched successfully",
  "data": [
    {
      "id": "64a7b8c9d0e1f2g3h4i5j6k7",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "MEMBER",
      "avatar": "https://example.com/avatar.jpg",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "membership": {
        "planId": "64b7b8c9d0e1f2g3h4i5j6k8",
        "planName": "Premium Monthly",
        "status": "active",
        "expiresAt": "2024-02-15T10:30:00.000Z"
      }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalUsers": 95,
    "limit": 20,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "filters": {
    "role": "MEMBER",
    "search": "john"
  }
}
```

---

## Forum APIs

The Forum APIs provide comprehensive discussion board functionality with posts, comments, likes, and category management. All write operations require authentication.

### 1. Get All Forum Posts (Public)
- **Endpoint:** `GET /api/forum/`
- **Auth:** None required (Public endpoint)
- **Query Parameters:**
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Posts per page (default: 20, max: 100)
  - `category` (optional): Filter by category ID
  - `period` (optional): Filter by time period (`today`, `week`, `month`, `year`, `all`)
- **Description:** Returns paginated forum posts with basic information and comment counts

**Frontend Example:**
```typescript
const fetchForumPosts = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters);
  const response = await fetch(`/api/forum?${queryParams}`);
  return response.json();
};

// Usage
const posts = await fetchForumPosts({
  page: '1',
  limit: '10',
  category: '64a7b8c9d0e1f2g3h4i5j6k7',
  period: 'week'
});
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "64a7b8c9d0e1f2g3h4i5j6k7",
      "title": "Best study techniques for programming",
      "content": "I've been struggling with retaining programming concepts...",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "authorId": "64b7b8c9d0e1f2g3h4i5j6k8",
      "categoryId": "64c7b8c9d0e1f2g3h4i5j6k9",
      "likeCount": 15,
      "_count": {
        "comments": 8
      }
    }
  ]
}
```

---

### 2. Get Forum Categories (Public)
- **Endpoint:** `GET /api/forum/categories`
- **Auth:** None required (Public endpoint)
- **Description:** Returns all active forum categories for filtering and display

**Frontend Example:**
```typescript
const fetchCategories = async () => {
  const response = await fetch('/api/forum/categories');
  return response.json();
};
```

---

### 3. Get Forum Post by ID
- **Endpoint:** `GET /api/forum/:id`
- **Auth:** Bearer Token (Auth0 Access Token) - Required
- **Description:** Returns detailed information about a specific forum post including author details and category

**Frontend Example:**
```typescript
const fetchPostById = async (postId) => {
  const token = await getAccessTokenSilently();
  const response = await fetch(`/api/forum/${postId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};
```

---

### 4. Create Forum Post
- **Endpoint:** `POST /api/forum/posts`
- **Auth:** Bearer Token (Auth0 Access Token) - Required
- **Request Body:**
```json
{
  "title": "Post title (required)",
  "content": "Post content (required)",
  "categoryId": "64a7b8c9d0e1f2g3h4i5j6k7 (required)",
  "tags": ["programming", "study-tips"] (optional),
  "image": "https://example.com/image.jpg (optional)"
}
```
- **Description:** Creates a new forum post

**Frontend Example:**
```typescript
const createPost = async (postData) => {
  const token = await getAccessTokenSilently();
  const response = await fetch('/api/forum/posts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(postData)
  });
  return response.json();
};

// Usage
const newPost = await createPost({
  title: "My First Post",
  content: "This is the content of my post",
  categoryId: "64a7b8c9d0e1f2g3h4i5j6k7",
  tags: ["programming", "beginners"]
});
```

---

### 5. Update Forum Post
- **Endpoint:** `PUT /api/forum/updatepost/:id`
- **Auth:** Bearer Token (Auth0 Access Token) - Required (Post author or Admin)
- **Request Body:**
```json
{
  "title": "Updated title (optional)",
  "content": "Updated content (optional)",
  "tags": ["updated", "tags"] (optional),
  "image": "https://example.com/new-image.jpg (optional)"
}
```

**Frontend Example:**
```typescript
const updatePost = async (postId, updates) => {
  const token = await getAccessTokenSilently();
  const response = await fetch(`/api/forum/updatepost/${postId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updates)
  });
  return response.json();
};
```

---

### 6. Delete Forum Post
- **Endpoint:** `DELETE /api/forum/posts/:postId`
- **Auth:** Bearer Token (Auth0 Access Token) - Required (Post author or Admin)
- **Description:** Deletes a forum post and all associated comments

---

### 7. Add Comment to Post
- **Endpoint:** `POST /api/forum/addcomment/:postId`
- **Auth:** Bearer Token (Auth0 Access Token) - Required
- **Request Body:**
```json
{
  "content": "This is a helpful comment (required)"
}
```

**Frontend Example:**
```typescript
const addComment = async (postId, content) => {
  const token = await getAccessTokenSilently();
  const response = await fetch(`/api/forum/addcomment/${postId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ content })
  });
  return response.json();
};
```

---

### 8. Get Comments for Post
- **Endpoint:** `GET /api/forum/comments/:postId`
- **Auth:** Bearer Token (Auth0 Access Token) - Required
- **Description:** Returns all comments for a specific forum post with author information

---

### 9. Like/Unlike Forum Post
- **Endpoint:** `POST /api/forum/like/:postId`
- **Auth:** Bearer Token (Auth0 Access Token) - Required
- **Description:** Toggles like status for a forum post (like if not liked, unlike if already liked)

**Frontend Example:**
```typescript
const togglePostLike = async (postId) => {
  const token = await getAccessTokenSilently();
  const response = await fetch(`/api/forum/like/${postId}`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};
```

---

### 10. Like/Unlike Comment
- **Endpoint:** `POST /api/forum/comments/like/:commentId`
- **Auth:** Bearer Token (Auth0 Access Token) - Required
- **Description:** Toggles like status for a comment

---

## Library APIs

The Library APIs handle library management, registration, approval workflow, and member management. Libraries go through an approval process managed by Super Admins.

### 1. Get All Libraries (Public)
- **Endpoint:** `GET /api/libraries/`
- **Auth:** None required (Public endpoint)
- **Query Parameters:**
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Libraries per page (default: 10)
  - `search` (optional): Search by name, address, or description
  - `city` (optional): Filter by city name
  - `minSeats` (optional): Comma-separated minimum seat counts
  - `membership` (optional): Filter by membership type (`Free`, `Paid`)
  - `minRating` (optional): Comma-separated minimum ratings
- **Description:** Returns paginated list of approved and active libraries with filtering capabilities

**Frontend Example:**
```typescript
const fetchLibraries = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters);
  const response = await fetch(`/api/libraries?${queryParams}`);
  return response.json();
};

// Usage with multiple filters
const libraries = await fetchLibraries({
  search: 'central library',
  city: 'New York',
  minRating: '4',
  membership: 'Free,Paid',
  page: '1',
  limit: '12'
});
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "64a7b8c9d0e1f2g3h4i5j6k7",
      "name": "Central Public Library",
      "description": "A modern library with extensive study facilities",
      "address": "123 Main Street",
      "city": "New York",
      "state": "NY",
      "country": "USA",
      "images": ["https://example.com/lib1.jpg", "https://example.com/lib2.jpg"],
      "rating": 4.5,
      "reviewCount": 89,
      "amenities": ["WIFI", "PARKING", "CAFE", "QUIET_ZONE"],
      "totalSeats": 150,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "openingHours": [
        {
          "id": "64b7b8c9d0e1f2g3h4i5j6k8",
          "dayOfWeek": 1,
          "openTime": "08:00",
          "closeTime": "22:00",
          "isClosed": false
        }
      ],
      "seats": [
        {
          "id": "64c7b8c9d0e1f2g3h4i5j6k9",
          "seatType": "REGULAR",
          "isAvailable": true
        }
      ],
      "seatPrices": [
        {
          "seatType": "REGULAR",
          "price": 5.00,
          "currency": "USD",
          "isHourly": true
        }
      ]
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 8,
    "totalLibraries": 95,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

### 2. Get Library by ID (Public)
- **Endpoint:** `GET /api/libraries/:id`
- **Auth:** None required (Public endpoint)
- **Description:** Returns detailed information about a specific library including all amenities, opening hours, seat types, and pricing

**Frontend Example:**
```typescript
const fetchLibraryById = async (libraryId) => {
  const response = await fetch(`/api/libraries/${libraryId}`);
  return response.json();
};
```

---

### 3. Get Library Registration Requests
- **Endpoint:** `GET /api/libraries/requests`
- **Auth:** Bearer Token (Super Admin) - Required
- **Description:** Returns all pending library registration requests for admin approval

**Frontend Example:**
```typescript
const fetchLibraryRequests = async () => {
  const token = await getAccessTokenSilently();
  const response = await fetch('/api/libraries/requests', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};
```

---

### 4. Register New Library
- **Endpoint:** `POST /api/libraries/register`
- **Auth:** Bearer Token (Member or Super Admin) - Required
- **Request Body:**
```json
{
  "name": "My New Library (required)",
  "description": "Description of the library (required)",
  "address": "Complete address (required)",
  "city": "City name (required)",
  "state": "State/Province (required)",
  "country": "Country (required)",
  "postalCode": "12345 (required)",
  "email": "library@example.com (required)",
  "phone": "+1234567890 (required)",
  "images": ["https://example.com/image1.jpg"] (optional),
  "amenities": ["WIFI", "PARKING", "CAFE"] (optional),
  "totalSeats": 100 (required),
  "additionalInformation": "Any additional info (optional)",
  "AdminGovernmentId": "Government ID (optional)",
  "AdminBio": "Admin biography (optional)",
  "AdminCompleteAddress": "Admin address (optional)",
  "AdminPhone": "Admin phone (optional)",
  "AdminPhoto": "Admin photo URL (optional)"
}
```
- **Description:** Registers a new library for approval. Status will be set to PENDING.

**Frontend Example:**
```typescript
const registerLibrary = async (libraryData) => {
  const token = await getAccessTokenSilently();
  const response = await fetch('/api/libraries/register', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(libraryData)
  });
  return response.json();
};

// Usage
const newLibrary = await registerLibrary({
  name: "Downtown Study Center",
  description: "Modern study facility in the heart of downtown",
  address: "456 Business District",
  city: "San Francisco",
  state: "CA",
  country: "USA",
  postalCode: "94102",
  email: "info@downtownstudycenter.com",
  phone: "+1-555-0123",
  totalSeats: 75,
  amenities: ["WIFI", "COFFEE", "QUIET_ZONE"]
});
```

---

### 5. Approve Library (Super Admin Only)
- **Endpoint:** `PATCH /api/libraries/:libraryId/approve`
- **Auth:** Bearer Token (Super Admin) - Required
- **Description:** Approves a pending library registration request

**Frontend Example:**
```typescript
const approveLibrary = async (libraryId) => {
  const token = await getAccessTokenSilently();
  const response = await fetch(`/api/libraries/${libraryId}/approve`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};
```

---

### 6. Reject Library (Super Admin Only)
- **Endpoint:** `PATCH /api/libraries/:libraryId/reject`
- **Auth:** Bearer Token (Super Admin) - Required
- **Description:** Rejects a pending library registration request

---

### 7. Get Library Members (Admin/Super Admin Only)
- **Endpoint:** `GET /api/libraries/:libraryId/members`
- **Auth:** Bearer Token (Admin or Super Admin) - Required
- **Description:** Returns all members of a specific library with their membership details

**Frontend Example:**
```typescript
const fetchLibraryMembers = async (libraryId) => {
  const token = await getAccessTokenSilently();
  const response = await fetch(`/api/libraries/${libraryId}/members`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};
```

---

### 8. Get Library Bookings (Admin/Super Admin Only)
- **Endpoint:** `GET /api/libraries/:libraryId/bookings`
- **Auth:** Bearer Token (Admin or Super Admin) - Required
- **Description:** Returns all seat bookings for a specific library

---

## Seat Booking APIs

The Seat Booking APIs handle seat management, availability checking, booking creation, and booking management. All operations require authentication.

### 1. Get All Seats in Library
- **Endpoint:** `GET /api/seats/library/:libraryId/seats`
- **Auth:** Bearer Token (Auth0 Access Token) - Required
- **Description:** Returns all seats in a library with their current booking status
- **Use Case:** Display seat layout, check seat types, view current bookings

**Frontend Example:**
```typescript
const fetchLibrarySeats = async (libraryId) => {
  const token = await getAccessTokenSilently();
  const response = await fetch(`/api/seats/library/${libraryId}/seats`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "64a7b8c9d0e1f2g3h4i5j6k7",
      "name": "A-001",
      "seatType": "REGULAR",
      "floor": 1,
      "section": "Study Area A",
      "isAvailable": true,
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "bookings": [
        {
          "date": "2024-01-20T00:00:00.000Z",
          "startTime": "09:00",
          "endTime": "12:00"
        }
      ]
    }
  ]
}
```

---

### 2. Get Seat Availability for Specific Date
- **Endpoint:** `GET /api/seats/library/:libraryId/availability?date=YYYY-MM-DD`
- **Auth:** Bearer Token (Auth0 Access Token) - Required
- **Query Parameters:**
  - `date` (required): Date in YYYY-MM-DD format
- **Description:** Returns seat availability slots for a specific date

**Frontend Example:**
```typescript
const fetchSeatAvailability = async (libraryId, date) => {
  const token = await getAccessTokenSilently();
  const response = await fetch(
    `/api/seats/library/${libraryId}/availability?date=${date}`,
    {
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );
  return response.json();
};

// Usage
const availability = await fetchSeatAvailability(
  '64a7b8c9d0e1f2g3h4i5j6k7',
  '2024-01-20'
);
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "seatId": "64a7b8c9d0e1f2g3h4i5j6k7",
      "name": "A-001",
      "type": "REGULAR",
      "bookedSlots": [
        {
          "date": "2024-01-20T00:00:00.000Z",
          "start": "09:00",
          "end": "12:00"
        }
      ]
    }
  ]
}
```

---

### 3. Create New Seat (Admin/Super Admin Only)
- **Endpoint:** `POST /api/seats/library/:libraryId/seats`
- **Auth:** Bearer Token (Admin or Super Admin) - Required
- **Request Body:**
```json
{
  "name": "A-025 (required)",
  "seatType": "REGULAR|QUIET_ZONE|COMPUTER|STUDY_ROOM|GROUP_TABLE (required)",
  "floor": 1 (optional, default: 1),
  "section": "Study Area A (optional)"
}
```
- **Description:** Creates a new seat in the specified library

**Frontend Example:**
```typescript
const createSeat = async (libraryId, seatData) => {
  const token = await getAccessTokenSilently();
  const response = await fetch(`/api/seats/library/${libraryId}/seats`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(seatData)
  });
  return response.json();
};

// Usage
const newSeat = await createSeat('64a7b8c9d0e1f2g3h4i5j6k7', {
  name: 'B-010',
  seatType: 'QUIET_ZONE',
  floor: 2,
  section: 'Silent Study Area'
});
```

---

### 4. Update Seat Details (Admin/Super Admin Only)
- **Endpoint:** `PUT /api/seats/seats/:seatId`
- **Auth:** Bearer Token (Admin or Super Admin) - Required
- **Request Body:** Same as create seat, all fields optional
- **Description:** Updates seat details such as name, type, floor, or section

**Frontend Example:**
```typescript
const updateSeat = async (seatId, updates) => {
  const token = await getAccessTokenSilently();
  const response = await fetch(`/api/seats/seats/${seatId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updates)
  });
  return response.json();
};
```

---

### 5. Delete Seat (Admin/Super Admin Only)
- **Endpoint:** `DELETE /api/seats/seats/:seatId`
- **Auth:** Bearer Token (Admin or Super Admin) - Required
- **Description:** Soft deletes a seat (sets isActive to false)

---

### 6. Book a Seat
- **Endpoint:** `POST /api/seats/book`
- **Auth:** Bearer Token (Auth0 Access Token) - Required
- **Request Body:**
```json
{
  "seatId": "64a7b8c9d0e1f2g3h4i5j6k7 (required)",
  "libraryId": "64b7b8c9d0e1f2g3h4i5j6k8 (required)",
  "date": "2024-01-20 (required, YYYY-MM-DD format)",
  "startTime": "09:00 (required, HH:MM format)",
  "endTime": "12:00 (required, HH:MM format)"
}
```
- **Description:** Books a seat for the authenticated user. Calculates price based on duration and seat type.

**Frontend Example:**
```typescript
const bookSeat = async (bookingData) => {
  const token = await getAccessTokenSilently();
  const response = await fetch('/api/seats/book', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bookingData)
  });
  return response.json();
};

// Usage
const booking = await bookSeat({
  seatId: '64a7b8c9d0e1f2g3h4i5j6k7',
  libraryId: '64b7b8c9d0e1f2g3h4i5j6k8',
  date: '2024-01-20',
  startTime: '14:00',
  endTime: '17:00'
});
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Seat booked successfully",
  "data": {
    "id": "64c7b8c9d0e1f2g3h4i5j6k9",
    "date": "2024-01-20T00:00:00.000Z",
    "startTime": "14:00",
    "endTime": "17:00",
    "duration": 3,
    "bookingPrice": 15.00,
    "currency": "USD",
    "status": "PENDING",
    "seatId": "64a7b8c9d0e1f2g3h4i5j6k7",
    "libraryId": "64b7b8c9d0e1f2g3h4i5j6k8",
    "userId": "64d7b8c9d0e1f2g3h4i5j6ka",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### 7. Get User's Bookings
- **Endpoint:** `GET /api/seats/my-bookings`
- **Auth:** Bearer Token (Auth0 Access Token) - Required
- **Query Parameters:**
  - `status` (optional): Filter by booking status (`PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`)
  - `page` (optional): Page number for pagination
  - `limit` (optional): Items per page
- **Description:** Returns all seat bookings for the authenticated user

**Frontend Example:**
```typescript
const fetchMyBookings = async (filters = {}) => {
  const token = await getAccessTokenSilently();
  const queryParams = new URLSearchParams(filters);
  const response = await fetch(`/api/seats/my-bookings?${queryParams}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};

// Usage
const myBookings = await fetchMyBookings({
  status: 'CONFIRMED',
  page: '1',
  limit: '10'
});
```

---

### 8. Cancel Booking
- **Endpoint:** `DELETE /api/seats/cancel-booking/:bookingId`
- **Auth:** Bearer Token (Auth0 Access Token) - Required
- **Description:** Cancels a seat booking (sets status to CANCELLED)

**Frontend Example:**
```typescript
const cancelBooking = async (bookingId) => {
  const token = await getAccessTokenSilently();
  const response = await fetch(`/api/seats/cancel-booking/${bookingId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};
```

---

## Membership APIs

The Membership APIs handle membership plan management and user memberships for libraries.

### Available Endpoints:
- `GET /api/memberships/` - Get membership plans
- `POST /api/memberships/` - Create membership plan (Admin)
- `GET /api/memberships/user/:userId` - Get user memberships
- `POST /api/memberships/subscribe` - Subscribe to membership plan

**Frontend Example:**
```typescript
const fetchMembershipPlans = async (libraryId) => {
  const response = await fetch(`/api/memberships?libraryId=${libraryId}`);
  return response.json();
};
```

---

## Dashboard APIs

The Dashboard APIs provide analytics and overview data for different user roles.

### Available Endpoints:
- `GET /api/dashboard/user` - User dashboard data
- `GET /api/dashboard/admin` - Admin dashboard data  
- `GET /api/dashboard/super-admin` - Super admin dashboard data

**Frontend Example:**
```typescript
const fetchDashboardData = async () => {
  const token = await getAccessTokenSilently();
  const response = await fetch('/api/dashboard/user', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};
```

---

## Reports APIs

The Reports APIs provide detailed analytics and reporting functionality.

### Available Endpoints:
- `GET /api/reports/library/:libraryId` - Library specific reports
- `GET /api/reports/user-activity` - User activity reports
- `GET /api/reports/bookings` - Booking statistics

**Frontend Example:**
```typescript
const fetchLibraryReports = async (libraryId, dateRange) => {
  const token = await getAccessTokenSilently();
  const response = await fetch(
    `/api/reports/library/${libraryId}?${new URLSearchParams(dateRange)}`,
    {
      headers: { 'Authorization': `Bearer ${token}` }
    }
  );
  return response.json();
};
```

---

## Error Handling

All API endpoints follow a consistent error response format:

### Error Response Format:
```json
{
  "success": false,
  "error": "Error message describing what went wrong",
  "code": "ERROR_CODE" // Optional error code
}
```

### Common HTTP Status Codes:
- **200**: Success
- **201**: Created successfully
- **400**: Bad Request (validation errors, missing fields)
- **401**: Unauthorized (missing or invalid Auth0 token)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found (resource doesn't exist)
- **409**: Conflict (duplicate data, booking conflicts)
- **500**: Internal Server Error

### Auth0 Token Errors:
```json
{
  "success": false,
  "error": "Unauthorized",
  "details": "Invalid or expired Auth0 access token"
}
```

### Validation Errors:
```json
{
  "success": false,
  "error": "Validation failed",
  "details": {
    "title": "Title is required",
    "categoryId": "Invalid category ID"
  }
}
```

---

## Data Models

### User Roles:
- **MEMBER**: Regular users who can book seats, participate in forums
- **ADMIN**: Library administrators who manage their library
- **SUPER_ADMIN**: System administrators with full access

### Seat Types:
- **REGULAR**: Standard study seats
- **QUIET_ZONE**: Silent study areas  
- **COMPUTER**: Computer workstations
- **STUDY_ROOM**: Private study rooms
- **GROUP_TABLE**: Group study tables

### Booking Status:
- **PENDING**: Booking created, awaiting confirmation
- **CONFIRMED**: Booking confirmed and active
- **CANCELLED**: Booking cancelled by user or admin
- **COMPLETED**: Booking session completed
- **NO_SHOW**: User didn't show up for booking

### Library Status:
- **PENDING**: Awaiting Super Admin approval
- **APPROVED**: Active and available for booking
- **REJECTED**: Registration denied

### Membership Status:
- **ACTIVE**: Current active membership
- **FREEZE**: Temporarily paused membership
- **EXPIRED**: Membership has expired
- **PENDING**: Payment pending
- **CANCELLED**: Membership cancelled

---

## Frontend Integration Best Practices

### 1. Error Handling:
```typescript
const handleAPICall = async (apiFunction) => {
  try {
    const response = await apiFunction();
    if (!response.success) {
      throw new Error(response.error);
    }
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    toast.error(error.message || 'Something went wrong');
    throw error;
  }
};
```

### 2. Token Management:
```typescript
const createAuthenticatedRequest = async (url, options = {}) => {
  const token = await getAccessTokenSilently();
  return fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers
    }
  });
};
```

### 3. Loading States:
```typescript
const [loading, setLoading] = useState(false);

const fetchData = async () => {
  setLoading(true);
  try {
    const data = await handleAPICall(() => fetchLibraries());
    setLibraries(data);
  } finally {
    setLoading(false);
  }
};
```

---

## Environment Configuration

### Required Environment Variables:
```env
# Database
DATABASE_URL="mongodb://localhost:27017/lms"

# Auth0
AUTH0_DOMAIN="dev-173h8fm3s2l6fjai.us.auth0.com"
AUTH0_CLIENT_ID="your_client_id"
AUTH0_CLIENT_SECRET="your_client_secret"

# Server
PORT=5000
NODE_ENV="development"

# Frontend URL for CORS
FRONTEND_URL="http://localhost:3000"
```

---

## Rate Limiting

- **Public endpoints**: 100 requests per 15 minutes per IP
- **Authenticated endpoints**: 1000 requests per 15 minutes per user
- **Admin endpoints**: 500 requests per 15 minutes per user

---

*Last Updated: June 4, 2025*
*API Version: 1.0.0*
*Auth Provider: Auth0*
