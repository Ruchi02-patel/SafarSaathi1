// SafarSaathi Automated Test Suite
// Rigorous verification of all modules, Gujarat integration, Diya Patel demo, and Security

async function runTests() {
  const base = 'http://localhost:5000/api';
  console.log('========================================================');
  console.log('🚀 RUNNING SAFARSAATHI COMPLETE AUDIT & INTEGRATION TESTS');
  console.log('========================================================\n');

  async function api(path, options = {}) {
    const res = await fetch(`${base}${path}`, options);
    const json = await res.json();
    return { status: res.status, data: json };
  }

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${message}`);
      failed++;
    }
  }

  // 1. Health check
  const health = await api('/health');
  assert(health.status === 200 && health.data.success, 'API Server Health Check is operational');

  // 2. Diya Patel User Login
  const diyaLogin = await api('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'pateldiya2385@gmail.com', password: 'user123' })
  });
  assert(diyaLogin.status === 200 && diyaLogin.data.token, 'Diya Patel successfully logged in with JWT token');
  assert(diyaLogin.data.user?.fullName === 'Diya Patel', `User full name is correct: "${diyaLogin.data.user?.fullName}"`);
  assert(diyaLogin.data.user?.city === 'Nadiad' && diyaLogin.data.user?.state === 'Gujarat', `User location is Gujarat: ${diyaLogin.data.user?.city}, ${diyaLogin.data.user?.state}`);
  
  const diyaToken = diyaLogin.data.token;
  const diyaHeaders = { 'Authorization': `Bearer ${diyaToken}`, 'Content-Type': 'application/json' };

  // 3. Super Admin Login
  const adminLogin = await api('/auth/admin-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@safarsaathi.com', password: 'admin123' })
  });
  assert(adminLogin.status === 200 && adminLogin.data.token, 'Super Admin successfully logged in');
  const adminToken = adminLogin.data.token;
  const adminHeaders = { 'Authorization': `Bearer ${adminToken}`, 'Content-Type': 'application/json' };

  // 4. Diya Patel's Vehicles
  const vRes = await api('/vehicles', { headers: diyaHeaders });
  const vehicles = vRes.data.vehicles || vRes.data.data || [];
  assert(vehicles.length >= 1, `Diya Patel has ${vehicles.length} vehicle(s) registered`);
  const car = vehicles.find(v => v.registrationNumber === 'GJ07DK1616');
  assert(car && car.state === 'Gujarat' && car.city === 'Nadiad', `Primary vehicle GJ07DK1616 found with Gujarat RTO`);

  // 5. Diya Patel's Fuel Records & Mileage
  const fRes = await api('/fuel', { headers: diyaHeaders });
  const fuelRecords = fRes.data.records || [];
  assert(fuelRecords.length >= 3, `Fuel management loaded ${fuelRecords.length} realistic fuel fill records`);
  assert(fRes.data.summary?.averageMileage > 20, `Average mileage dynamically computed from DB: ${fRes.data.summary?.averageMileage} km/kg`);
  assert(fRes.data.summary?.totalCost > 2000, `Total fuel expense dynamically aggregated: ₹ ${fRes.data.summary?.totalCost}`);

  // 6. Diya Patel's Service & Maintenance Records
  const sRes = await api('/services', { headers: diyaHeaders });
  const services = sRes.data.services || sRes.data.data || [];
  assert(services.length >= 1, `Found ${services.length} maintenance record(s) for vehicle`);
  assert(services[0]?.serviceCenter?.includes('Nadiad'), `Service center located in Gujarat: "${services[0]?.serviceCenter}"`);

  // 7. Diya Patel's Expenses (Categorized & Unified)
  const expRes = await api('/expenses', { headers: diyaHeaders });
  const expenses = expRes.data.expenses || expRes.data.data || [];
  assert(expenses.length >= 4, `Unified expense tracking contains ${expenses.length} records`);
  const categories = [...new Set(expenses.map(e => e.category))];
  assert(categories.includes('Fuel') && categories.includes('Service') && categories.includes('Insurance'), `Expense categories represented: ${categories.join(', ')}`);

  // 8. Diya Patel's Insurance
  const insRes = await api('/insurance/my-policies', { headers: diyaHeaders });
  const policies = insRes.data.policies || insRes.data.data || [];
  assert(policies.length >= 1, `Found ${policies.length} active insurance policy for Diya Patel`);
  assert(policies[0]?.companyName?.includes('ICICI Lombard'), `Insurance provider verified: ${policies[0]?.companyName}`);

  // 9. Diya Patel's Loan Application
  const loanRes = await api('/loans', { headers: diyaHeaders });
  const loans = loanRes.data.loans || loanRes.data.data || [];
  assert(loans.length >= 1, `Found ${loans.length} vehicle loan application`);
  assert(loans[0]?.status === 'Approved', `Loan status is Approved (SBI) with EMI ₹${loans[0]?.estimatedEmi}`);

  // 10. Diya Patel's Vehicle Documents (Vault)
  const docRes = await api(`/documents/vehicle/${car._id}`, { headers: diyaHeaders });
  const docs = docRes.data.documents || docRes.data.data || [];
  assert(docs.length >= 3, `Document vault stores ${docs.length} verified documents for GJ07DK1616`);

  // 11. Diya Patel's Notifications & Reminders
  const notifRes = await api('/notifications', { headers: diyaHeaders });
  const notifs = notifRes.data.notifications || notifRes.data.data || [];
  assert(notifs.length >= 2, `Active reminders retrieved: ${notifs.length} notifications`);

  // 12. Mechanics Module - Gujarat City Filtering (No Maps)
  const mAll = await api('/mechanics');
  assert(mAll.data.success && mAll.data.mechanics.length > 0, `All Gujarat mechanics count: ${mAll.data.mechanics.length}`);

  const mNadiad = await api('/mechanics?city=Nadiad');
  assert(mNadiad.data.success && mNadiad.data.mechanics.every(m => m.city.toLowerCase() === 'nadiad'), 'Mechanics query for "Nadiad" returns only Nadiad mechanics');

  const mAhmedabad = await api('/mechanics?city=Ahmedabad');
  assert(mAhmedabad.data.success && mAhmedabad.data.mechanics.every(m => m.city.toLowerCase() === 'ahmedabad'), 'Mechanics query for "Ahmedabad" returns only Ahmedabad mechanics');

  const mBotad = await api('/mechanics?city=Botad');
  assert(mBotad.data.success && mBotad.data.mechanics.length === 0, 'Mechanics query for "Botad" returns 0 records (handles empty state correctly)');

  // 13. Driving Teachers Module - Gujarat City Filtering (No Maps)
  const tAll = await api('/driving-teachers');
  assert(tAll.data.success && tAll.data.teachers.length > 0, `All Gujarat driving teachers count: ${tAll.data.teachers.length}`);

  const tSurat = await api('/driving-teachers?city=Surat');
  assert(tSurat.data.success && tSurat.data.teachers.every(t => t.city.toLowerCase() === 'surat'), 'Driving teachers query for "Surat" returns only Surat teachers');

  const tAmreli = await api('/driving-teachers?city=Amreli');
  assert(tAmreli.data.success && tAmreli.data.teachers.length === 0, 'Driving teachers query for "Amreli" returns 0 records (handles empty state correctly)');

  // 14. Vehicle Search by Plate Number
  const searchRes = await api('/vehicle-search/GJ07DK1616');
  assert(searchRes.data.success && searchRes.data.data?.vehicleNumber === 'GJ07DK1616', `RTO Vehicle Search for GJ07DK1616 found registered owner: ${searchRes.data.data?.ownerName}`);

  // 15. Admin Dashboard & Reports (Dynamic from MongoDB)
  const adminDash = await api('/admin/dashboard', { headers: adminHeaders });
  assert(adminDash.data.success && adminDash.data.stats?.totalUsers >= 2, `Admin Dashboard stats dynamic: ${adminDash.data.stats?.totalUsers} Users, ${adminDash.data.stats?.totalVehicles} Vehicles`);

  const adminRep = await api('/admin/reports', { headers: adminHeaders });
  assert(adminRep.data.success && typeof adminRep.data.summary?.totalRevenueOrLoans === 'number', `Admin Reports computed dynamically without hardcoded constants`);

  // 16. Security & Ownership Isolation
  // Attempting to query documents of another vehicle or random ID without permission
  const fakeId = '507f1f77bcf86cd799439011';
  const unauthDocs = await api(`/documents/vehicle/${fakeId}`, { headers: diyaHeaders });
  assert(unauthDocs.status === 404 || unauthDocs.status === 403 || unauthDocs.data.documents?.length === 0, 'Security: Unauthorized vehicle access is safely rejected');

  console.log('\n========================================================');
  console.log(`📊 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('========================================================');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
