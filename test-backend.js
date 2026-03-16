// Backend Test Script
// Run this to test all backend endpoints

const testBackend = async () => {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🧪 Testing Backend Systems...\n');
  
  // Test 1: Partner Application
  console.log('1. Testing Partner Application...');
  try {
    const partnerResponse = await fetch(`${baseUrl}/api/partners`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Partner',
        mobile: '1234567890',
        area: 'Jaipur',
        type: 'TEAM_BOY',
        extra: 'Test extra info'
      })
    });
    
    if (partnerResponse.ok) {
      const data = await partnerResponse.json();
      console.log('✅ Partner API Working:', data.success);
    } else {
      console.log('❌ Partner API Failed');
    }
  } catch (error) {
    console.log('❌ Partner API Error:', error.message);
  }
  
  // Test 2: Service Order
  console.log('\n2. Testing Service Order...');
  try {
    const orderResponse = await fetch(`${baseUrl}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientName: 'Test Client',
        clientMobile: '1234567890',
        clientArea: 'Jaipur',
        serviceType: 'PAMPHLET_DISTRIBUTION',
        budget: 5000
      })
    });
    
    if (orderResponse.ok) {
      const data = await orderResponse.json();
      console.log('✅ Order API Working:', data.success);
    } else {
      console.log('❌ Order API Failed');
    }
  } catch (error) {
    console.log('❌ Order API Error:', error.message);
  }
  
  // Test 3: Enquiry
  console.log('\n3. Testing Enquiry...');
  try {
    const enquiryResponse = await fetch(`${baseUrl}/api/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Enquiry',
        mobile: '1234567890',
        location: 'Jaipur',
        requirement: 'Test requirement'
      })
    });
    
    if (enquiryResponse.ok) {
      const data = await enquiryResponse.json();
      console.log('✅ Enquiry API Working:', data.success);
    } else {
      console.log('❌ Enquiry API Failed');
    }
  } catch (error) {
    console.log('❌ Enquiry API Error:', error.message);
  }
  
  console.log('\n🎉 Backend Testing Complete!');
};

testBackend();
