const https = require('https');
const http = require('http');
const { URL } = require('url');

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;
    
    const req = client.request(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    
    req.on('error', reject);
    req.end();
  });
}

async function testBackendAPI() {
  console.log('Testing Backend API...');
  console.log('====================');
  
  try {
    // Test basic endpoint
    console.log('1. Testing GET /api/test');
    const testResult = await makeRequest('http://localhost:5000/api/test');
    console.log('✅ Test endpoint:', testResult.data.message);
    
    // Test library profile endpoint (should return 401)
    console.log('\n2. Testing GET /api/library/profile (without auth)');
    const profileResult = await makeRequest('http://localhost:5000/api/library/profile');
    console.log(`Status: ${profileResult.status}`);
    console.log('Response:', profileResult.data);
    
    if (profileResult.status === 401) {
      console.log('✅ Authentication is working - returned 401 as expected');
    } else {
      console.log('❌ Expected 401 status for unauthenticated request');
    }
    
  } catch (error) {
    console.error('❌ Error testing backend:', error.message);
  }
}

testBackendAPI();
