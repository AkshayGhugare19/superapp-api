const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function testCallback() {
  try {
    // Read the test payload
    const payload = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'callback-test.json'), 'utf8')
    );

    // Update timestamp to current time
    payload.timestamp = new Date().toISOString();

    console.log('Sending callback request with payload:', JSON.stringify(payload, null, 2));

    // Send the request
    const response = await axios.post('http://localhost:3000/api/kyc/callback', payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Response Status:', response.status);
    console.log('Response Data:', response.data);
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error Status:', error.response.status);
      console.error('Error Data:', error.response.data);
      
      // Check for specific validation errors
      if (error.response.data.message === "'PartnerParams' is required.") {
        console.error('\nValidation Error: PartnerParams is missing or invalid');
        console.error('Please ensure your request includes PartnerParams with job_id, user_id, and job_type');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message);
    }
  }
}

// Test with valid data
testCallback();

// Test with invalid data (missing PartnerParams)
async function testInvalidCallback() {
  try {
    const invalidPayload = {
      SmileJobID: "test-job-123",
      ResultCode: "0810",
      ResultText: "Document Verified",
      IsFinalResult: true,
      Actions: {
        Liveness_Check: "passed"
      },
      signature: "test-signature-789",
      timestamp: new Date().toISOString()
    };

    console.log('\nTesting with invalid payload (missing PartnerParams):');
    console.log('Payload:', JSON.stringify(invalidPayload, null, 2));

    const response = await axios.post('http://localhost:3000/api/kyc/callback', invalidPayload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Response Status:', response.status);
    console.log('Response Data:', response.data);
  } catch (error) {
    if (error.response) {
      console.error('Error Status:', error.response.status);
      console.error('Error Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

// Uncomment to test with invalid data
// testInvalidCallback(); 