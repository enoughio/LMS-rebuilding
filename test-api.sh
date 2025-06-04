#!/bin/bash

echo "Testing Library Profile Backend API..."
echo "========================================="

# Test GET endpoint
echo "1. Testing GET /api/library/profile"
echo "   (This will fail without proper Auth0 token - expected)"
curl -X GET "http://localhost:5000/api/library/profile" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n" \
  2>/dev/null || echo "Connection failed - make sure backend is running on port 5000"

echo ""
echo "2. Testing health/status of backend server"
curl -X GET "http://localhost:5000/health" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n" \
  2>/dev/null || echo "Health endpoint not available"

echo ""
echo "Backend API Test Complete!"
echo "Note: 401/403 errors are expected without proper authentication"
