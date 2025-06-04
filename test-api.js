// Test script for library profile API
const testAPI = async () => {
  console.log('Testing Library Profile API...');
  
  try {
    // Test 1: Backend test endpoint
    console.log('\n1. Testing backend test endpoint...');
    const testResponse = await fetch('http://localhost:5000/api/test');
    const testData = await testResponse.json();
    console.log('✓ Backend test endpoint working:', testData.message);
    
    // Test 2: Library profile endpoint (should return 401)
    console.log('\n2. Testing library profile endpoint (expecting 401)...');
    const profileResponse = await fetch('http://localhost:5000/api/library/profile');
    console.log('Status:', profileResponse.status);
    if (profileResponse.status === 401) {
      console.log('✓ Library profile endpoint correctly returns 401 (authentication required)');
    } else {
      const errorData = await profileResponse.text();
      console.log('Response:', errorData);
    }
    
    // Test 3: Frontend API route (should also return 401)
    console.log('\n3. Testing frontend API route (expecting 401)...');
    const frontendResponse = await fetch('http://localhost:3000/api/library/profile');
    console.log('Status:', frontendResponse.status);
    if (frontendResponse.status === 401) {
      console.log('✓ Frontend API route correctly returns 401 (authentication required)');
    } else {
      const frontendData = await frontendResponse.text();
      console.log('Response:', frontendData);
    }
    
  } catch (error) {
    console.error('Error during testing:', error.message);
  }
};

testAPI();
