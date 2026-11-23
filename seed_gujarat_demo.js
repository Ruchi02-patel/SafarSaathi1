// ========================================================
// SafarSaathi - Gujarat Focus & Demo User (Diya Patel) Seeding
// Safe, Non-Destructive, Idempotent Seeding Script
// ========================================================

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });
const connectDB = require('../config/db');

const {
  User,
  Vehicle,
  VehicleDocument,
  Insurance,
  Loan,
  Mechanic,
  DrivingTeacher,
  Location,
  Expense,
  ServiceMaintenance,
  Notification,
  FuelRecord,
  Admin,
  VehicleSearch
} = require('../models');

async function seedGujaratDemo() {
  try {
    console.log('🔄 Connecting to database for Gujarat & Diya Patel demo setup...');
    await connectDB();

    const salt = await bcrypt.genSalt(10);
    const demoPasswordHash = await bcrypt.hash('user123', salt);
    const adminPasswordHash = await bcrypt.hash('admin123', salt);

    // ==========================================
    // 1. Ensure Super Admin Account
    // ==========================================
    let admin = await Admin.findOne({ email: 'admin@safarsaathi.com' });
    if (!admin) {
      admin = await Admin.create({
        name: 'SafarSaathi Gujarat Admin',
        email: 'admin@safarsaathi.com',
        password: adminPasswordHash,
        role: 'Super Admin',
        status: 'Active',
        lastLogin: new Date()
      });
      console.log('✅ Admin initialized: admin@safarsaathi.com / admin123');
    } else {
      admin.password = adminPasswordHash;
      await admin.save();
      console.log('ℹ️ Admin credentials refreshed: admin@safarsaathi.com / admin123');
    }

    // ==========================================
    // 2. Demo User: Diya Patel (Nadiad, Gujarat)
    // ==========================================
    const diyaEmail = 'pateldiya2385@gmail.com';
    let diya = await User.findOne({ email: diyaEmail });

    if (!diya) {
      diya = await User.create({
        fullName: 'Diya Patel',
        email: diyaEmail,
        phone: '9313599609',
        password: demoPasswordHash,
        accountType: 'Individual',
        address: 'College Road, Near Santram Mandir, Nadiad',
        city: 'Nadiad',
        state: 'Gujarat',
        status: 'Active',
        role: 'User'
      });
      console.log(`✅ Demo User created: ${diya.fullName} (${diyaEmail})`);
    } else {
      diya.fullName = 'Diya Patel';
      diya.password = demoPasswordHash;
      diya.city = 'Nadiad';
      diya.state = 'Gujarat';
      diya.address = diya.address || 'College Road, Near Santram Mandir, Nadiad';
      await diya.save();
      console.log(`ℹ️ Demo User verified & refreshed: ${diya.fullName} (${diyaEmail})`);
    }

    // ==========================================
    // 3. Diya's Vehicles
    // ==========================================
    // Primary Car: Maruti Suzuki Brezza VXi (CNG)
    let car = await Vehicle.findOne({ vehicleNumber: 'GJ07DK1616' });
    const carExpiry = new Date(Date.now() + 130 * 24 * 60 * 60 * 1000); // 130 days left
    const carNextService = new Date(Date.now() + 42 * 24 * 60 * 60 * 1000); // 42 days left
    const carPucExpiry = new Date(Date.now() + 115 * 24 * 60 * 60 * 1000);

    if (!car) {
      car = await Vehicle.create({
        userId: diya._id,
        vehicleNumber: 'GJ07DK1616',
        ownerName: 'Diya Patel',
        city: 'Nadiad',
        state: 'Gujarat',
        phoneNumber: '9313599609',
        vehicleType: '4 Wheeler',
        brand: 'Maruti Suzuki',
        model: 'Breeza vxi',
        fuelType: 'CNG',
        chassisNumber: 'MA3EJKD1S00123456',
        engineNumber: 'K15B1234567',
        color: 'Pearl Arctic White',
        registrationDate: new Date('2024-03-15'),
        insuranceStartDate: new Date('2024-03-15'),
        insuranceExpiryDate: carExpiry,
        insuranceStatus: 'Active',
        pucExpiryDate: carPucExpiry,
        pucStatus: 'Valid',
        nextServiceDate: carNextService,
        currentMileage: 8735,
        status: 'Active'
      });
      console.log(`✅ Car created: ${car.vehicleNumber} (${car.brand} ${car.model})`);
    } else {
      car.userId = diya._id;
      car.ownerName = 'Diya Patel';
      car.city = 'Nadiad';
      car.state = 'Gujarat';
      car.fuelType = 'CNG';
      car.insuranceStatus = 'Active';
      car.insuranceExpiryDate = carExpiry;
      car.nextServiceDate = carNextService;
      car.currentMileage = 8735;
      await car.save();
      console.log(`ℹ️ Car updated: ${car.vehicleNumber} (${car.brand} ${car.model})`);
    }

    // Secondary Scooter: Honda Activa 6G (Petrol)
    let scooter = await Vehicle.findOne({ vehicleNumber: 'GJ07BJ2442' });
    const scootExpiry = new Date(Date.now() + 210 * 24 * 60 * 60 * 1000);
    const scootNextService = new Date(Date.now() + 75 * 24 * 60 * 60 * 1000);

    if (!scooter) {
      scooter = await Vehicle.create({
        userId: diya._id,
        vehicleNumber: 'GJ07BJ2442',
        ownerName: 'Diya Patel',
        city: 'Nadiad',
        state: 'Gujarat',
        phoneNumber: '9313599609',
        vehicleType: '2 Wheeler',
        brand: 'Honda',
        model: 'Activa 6G',
        fuelType: 'Petrol',
        chassisNumber: 'ME4JF912345678901',
        engineNumber: 'JF91E8765432',
        color: 'Matte Axis Grey Metallic',
        registrationDate: new Date('2023-08-20'),
        insuranceStartDate: new Date('2023-08-20'),
        insuranceExpiryDate: scootExpiry,
        insuranceStatus: 'Active',
        pucExpiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
        pucStatus: 'Valid',
        nextServiceDate: scootNextService,
        currentMileage: 4620,
        status: 'Active'
      });
      console.log(`✅ Scooter created: ${scooter.vehicleNumber} (${scooter.brand} ${scooter.model})`);
    }

    // Also register in VehicleSearch collection for instant RTO plate queries
    let vsCar = await VehicleSearch.findOne({ vehicleNumber: 'GJ07DK1616' });
    if (!vsCar) {
      await VehicleSearch.create({
        vehicleNumber: 'GJ07DK1616',
        ownerName: 'Diya Patel',
        vehicleType: '4 Wheeler',
        brand: 'Maruti Suzuki',
        model: 'Breeza vxi',
        fuelType: 'CNG',
        registrationCity: 'Nadiad (GJ-07)',
        registrationState: 'Gujarat',
        registrationDate: new Date('2024-03-15'),
        chassisNumber: 'MA3E••••3456',
        engineNumber: 'K15B••••4567',
        insuranceValidity: 'Active (Valid till 2025)',
        pucValidity: 'Valid (Pass)',
        status: 'Active'
      });
      console.log('✅ VehicleSearch RTO record created for GJ07DK1616');
    }

    // ==========================================
    // 4. Fuel & Mileage Records (Realistic Progression)
    // ==========================================
    const existingFuel = await FuelRecord.find({ vehicleId: car._id });
    if (existingFuel.length === 0) {
      const fuelRecords = [
        {
          userId: diya._id,
          vehicleId: car._id,
          fuelType: 'CNG',
          fuelQuantity: 8.5,
          fuelCost: 701.25,
          odometerReading: 8200,
          fuelStation: 'Gujarat Gas CNG Station, Nadiad Highway',
          fuelDate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
          distanceTravelled: 0,
          calculatedMileage: 0,
          notes: 'Full tank refill'
        },
        {
          userId: diya._id,
          vehicleId: car._id,
          fuelType: 'CNG',
          fuelQuantity: 9.0,
          fuelCost: 742.50,
          odometerReading: 8460,
          fuelStation: 'Adani Total Gas CNG Station, Anand',
          fuelDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
          distanceTravelled: 260,
          calculatedMileage: 28.89, // (8460 - 8200) / 9.0 kg = 28.89 km/kg
          notes: 'Anand trip refill'
        },
        {
          userId: diya._id,
          vehicleId: car._id,
          fuelType: 'CNG',
          fuelQuantity: 9.2,
          fuelCost: 759.00,
          odometerReading: 8735,
          fuelStation: 'Torrent Gas CNG, Ahmedabad-Vadodara Expressway',
          fuelDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
          distanceTravelled: 275,
          calculatedMileage: 29.89, // (8735 - 8460) / 9.2 kg = 29.89 km/kg
          notes: 'Expressway refill'
        }
      ];

      for (const fr of fuelRecords) {
        await FuelRecord.create(fr);
        // Matching expense entry
        await Expense.create({
          userId: diya._id,
          vehicleId: car._id,
          category: 'Fuel',
          amount: fr.fuelCost,
          date: fr.fuelDate,
          paymentMethod: 'UPI',
          description: `CNG Refill (${fr.fuelQuantity} kg) at ${fr.fuelStation}`
        });
      }
      console.log('✅ Fuel & mileage records created for Diya Patel (GJ07DK1616)');
    } else {
      console.log(`ℹ️ Fuel records already exist (${existingFuel.length} entries)`);
    }

    // ==========================================
    // 5. Service & Maintenance History
    // ==========================================
    const sDate = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
    let kiranService = await ServiceMaintenance.findOne({ vehicleId: car._id, serviceCenter: /Kiran Motors/i });
    if (!kiranService) {
      let oldService = await ServiceMaintenance.findOne({ vehicleId: car._id });
      if (oldService && (oldService.serviceCenter === 'abc auto' || !oldService.serviceCenter)) {
        oldService.serviceCenter = 'Kiran Motors Authorized Maruti Service Center, Nadiad';
        oldService.serviceType = 'Periodic Maintenance';
        oldService.cost = 2450;
        oldService.mileage = 5000;
        oldService.nextServiceDate = carNextService;
        oldService.description = '5,000 km 2nd periodic free service, synthetic engine oil top-up, brake inspection, washer fluid refill.';
        await oldService.save();
        console.log('✅ Updated existing service record to Kiran Motors Nadiad');
      } else {
        await ServiceMaintenance.create({
          userId: diya._id,
          vehicleId: car._id,
          serviceType: 'Periodic Maintenance',
          serviceDate: sDate,
          cost: 2450,
          mileage: 5000,
          serviceCenter: 'Kiran Motors Authorized Maruti Service Center, Nadiad',
          description: '5,000 km 2nd periodic free service, synthetic engine oil top-up, brake inspection, washer fluid refill.',
          nextServiceDate: carNextService,
          status: 'Completed'
        });
        console.log('✅ Service maintenance record created at Kiran Motors Nadiad');
      }
    } else {
      console.log('ℹ️ Service maintenance record at Kiran Motors already exists');
    }

    // Ensure synchronized Service expense exists
    let serviceExp = await Expense.findOne({ userId: diya._id, category: 'Service' });
    if (!serviceExp) {
      await Expense.create({
        userId: diya._id,
        vehicleId: car._id,
        category: 'Service',
        amount: 2450,
        date: sDate,
        paymentMethod: 'Debit Card',
        description: 'Periodic Service & Maintenance at Kiran Motors, Nadiad'
      });
      console.log('✅ Service expense created');
    }

    // Fastag toll expense for expressway
    const tollExpense = await Expense.findOne({ userId: diya._id, description: { $regex: /Fastag/i } });
    if (!tollExpense) {
      await Expense.create({
        userId: diya._id,
        vehicleId: car._id,
        category: 'Others',
        amount: 320,
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        paymentMethod: 'UPI',
        description: 'NE1 Ahmedabad-Vadodara Expressway Fastag Toll'
      });
      console.log('✅ Fastag toll expense created');
    }

    // ==========================================
    // 6. Insurance Policy Record
    // ==========================================
    let insurance = await Insurance.findOne({ userId: diya._id, vehicleId: car._id });
    if (!insurance) {
      insurance = await Insurance.create({
        userId: diya._id,
        vehicleId: car._id,
        companyName: 'ICICI Lombard General Insurance',
        planName: 'Comprehensive Bumper-to-Bumper with Zero Dep',
        policyNumber: 'POL-GJ07-889412',
        coverageAmount: 820000,
        premiumAmount: 14500,
        startDate: new Date('2024-03-15'),
        expiryDate: carExpiry,
        status: 'Active',
        policyDocument: '/uploads/sample-insurance.pdf'
      });

      // Synchronize insurance expense
      await Expense.create({
        userId: diya._id,
        vehicleId: car._id,
        category: 'Insurance',
        amount: 14500,
        date: new Date('2024-03-15'),
        paymentMethod: 'Net Banking',
        description: 'Annual Comprehensive Vehicle Insurance Premium (ICICI Lombard - POL-GJ07-889412)'
      });

      console.log('✅ Active Insurance policy & premium expense created');
    } else {
      console.log('ℹ️ Insurance policy already exists');
    }

    // ==========================================
    // 7. Vehicle Loan Application
    // ==========================================
    let loan = await Loan.findOne({ userId: diya._id, vehicleId: car._id });
    if (!loan) {
      loan = await Loan.create({
        userId: diya._id,
        vehicleId: car._id,
        loanAmount: 450000,
        tenureMonths: 48,
        interestRate: 8.5,
        estimatedEmi: 11091,
        bankName: 'State Bank of India',
        employmentType: 'Salaried',
        monthlyIncome: 65000,
        status: 'Approved',
        appliedDate: new Date('2024-03-10'),
        remarks: 'Approved under SBI Car Loan Scheme. Auto-debit mandate active on SBI Nadiad Account.'
      });
      console.log('✅ Approved Vehicle Loan created for Diya Patel');
    } else {
      console.log('ℹ️ Vehicle Loan record already exists');
    }

    // ==========================================
    // 8. Vehicle Documents (Document Vault)
    // ==========================================
    const docTypes = [
      {
        type: 'RC Book',
        name: 'RC Smart Card - GJ07DK1616',
        fileUrl: '/uploads/sample-rc-book.pdf',
        status: 'Verified'
      },
      {
        type: 'Insurance',
        name: 'Insurance Certificate - ICICI Lombard',
        fileUrl: '/uploads/sample-insurance.pdf',
        status: 'Verified'
      },
      {
        type: 'PUC',
        name: 'PUC Green Emission Certificate',
        fileUrl: '/uploads/sample-puc.pdf',
        status: 'Verified'
      },
      {
        type: 'Driving Licence',
        name: 'Driving Licence - Diya Patel',
        fileUrl: '/uploads/sample-driving-licence.pdf',
        status: 'Verified'
      }
    ];

    for (const dt of docTypes) {
      const existingDoc = await VehicleDocument.findOne({
        userId: diya._id,
        vehicleId: car._id,
        documentType: dt.type
      });
      if (!existingDoc) {
        await VehicleDocument.create({
          userId: diya._id,
          vehicleId: car._id,
          documentType: dt.type,
          documentName: dt.name,
          fileUrl: dt.fileUrl,
          status: dt.status
        });
        console.log(`✅ Document vaulted: ${dt.type}`);
      }
    }

    // ==========================================
    // 9. Active Reminders & Notifications
    // ==========================================
    const notifDefs = [
      {
        title: 'Periodic 10,000 km Service Due Soon',
        message: 'Your Maruti Suzuki Brezza (GJ07DK1616) is due for periodic maintenance service in 42 days.',
        type: 'Service Reminder',
        dueDate: carNextService
      },
      {
        title: 'PUC Certificate Validity Active',
        message: 'PUC Emission Certificate for GJ07DK1616 is valid till next renewal in Gujarat.',
        type: 'PUC Expiry',
        dueDate: carPucExpiry
      },
      {
        title: 'Vehicle Loan Approved & Active',
        message: 'Your vehicle financing of ₹4,50,000 by SBI Nadiad Branch is approved with monthly EMI of ₹11,091.',
        type: 'Loan Update',
        dueDate: new Date()
      }
    ];

    for (const nd of notifDefs) {
      const existingNotif = await Notification.findOne({
        userId: diya._id,
        title: nd.title
      });
      if (!existingNotif) {
        await Notification.create({
          userId: diya._id,
          vehicleId: car._id,
          title: nd.title,
          message: nd.message,
          type: nd.type,
          dueDate: nd.dueDate,
          isRead: false
        });
      }
    }
    console.log('✅ Reminders and notifications initialized for Diya Patel');

    // ==========================================
    // 10. Verified Gujarat Mechanics (Across Cities)
    // ==========================================
    const gujaratMechanics = [
      {
        name: 'Bhavesh Patel',
        shopName: 'Nadiad Auto Care & Maruti Specialist',
        phone: '9825567890',
        city: 'Nadiad',
        state: 'Gujarat',
        address: 'Station Road, Near Santram Mandir, Nadiad',
        specialization: 'General Service & CNG Tuning',
        experienceYears: 14,
        rating: 4.9,
        reviewCount: 88,
        timing: '8:30 AM - 8:30 PM',
        servicesOffered: ['CNG Kit Tuning', 'Engine Oil Change', 'Brake Pad Replacement', 'Computerized Scanning']
      },
      {
        name: 'Rajesh Patel',
        shopName: 'Patel Automobile & Multi-brand Car Care',
        phone: '9825012345',
        city: 'Ahmedabad',
        state: 'Gujarat',
        address: 'Near Pakwan Cross Road, SG Highway, Bodakdev, Ahmedabad',
        specialization: 'General Service & Repair',
        experienceYears: 16,
        rating: 4.8,
        reviewCount: 142,
        timing: '9:00 AM - 8:00 PM',
        servicesOffered: ['Engine Diagnostics', 'AC Repair', 'Wheel Alignment', 'Suspension Tuning']
      },
      {
        name: 'Kishore Shah',
        shopName: 'Surat Express Garage & Motor Works',
        phone: '9825123456',
        city: 'Surat',
        state: 'Gujarat',
        address: 'Ring Road, Near Majura Gate, Surat',
        specialization: 'Engine Overhaul',
        experienceYears: 12,
        rating: 4.7,
        reviewCount: 95,
        timing: '9:00 AM - 8:30 PM',
        servicesOffered: ['Engine Overhaul', 'Clutch Replacement', 'Oil Service', 'Brake Overhaul']
      },
      {
        name: 'Jignesh Desai',
        shopName: 'Sayaji Motors & Multi-brand Car Care',
        phone: '9825234567',
        city: 'Vadodara',
        state: 'Gujarat',
        address: 'Old Padra Road, Near Akota Bridge, Vadodara',
        specialization: 'Electrical & Battery',
        experienceYears: 10,
        rating: 4.9,
        reviewCount: 110,
        timing: '8:00 AM - 8:00 PM',
        servicesOffered: ['Battery Replacement', 'Wiring Repair', 'ECU Scanning', 'Alternator Service']
      },
      {
        name: 'Haresh Solanki',
        shopName: 'Kathiyawad Auto Works',
        phone: '9825345678',
        city: 'Rajkot',
        state: 'Gujarat',
        address: 'Gondal Road, Near ST Central Workshop, Rajkot',
        specialization: 'Brakes & Suspension',
        experienceYears: 15,
        rating: 4.6,
        reviewCount: 74,
        timing: '9:00 AM - 7:30 PM',
        servicesOffered: ['Brake Service', 'Suspension Overhaul', 'Tire Rotation', 'Steering Repair']
      },
      {
        name: 'Amit Prajapati',
        shopName: 'Capital Car Care & Express Service',
        phone: '9825456789',
        city: 'Gandhinagar',
        state: 'Gujarat',
        address: 'Sector 11, Near GH-Road Circle, Gandhinagar',
        specialization: 'General Service',
        experienceYears: 8,
        rating: 4.8,
        reviewCount: 65,
        timing: '9:00 AM - 8:00 PM',
        servicesOffered: ['Periodic Maintenance', 'Car Wash & Detailing', 'Coolant Flush', 'Wheel Balancing']
      },
      {
        name: 'Dinesh Macwan',
        shopName: 'Charotar Car Clinic',
        phone: '9825678901',
        city: 'Anand',
        state: 'Gujarat',
        address: 'Amul Dairy Road, Anand',
        specialization: 'Car AC Servicing',
        experienceYears: 11,
        rating: 4.7,
        reviewCount: 58,
        timing: '9:30 AM - 8:00 PM',
        servicesOffered: ['Car AC Gas Refill', 'Compressor Repair', 'Filter Cleaning', 'Radiator Service']
      },
      {
        name: 'Sunil Varma',
        shopName: 'Narmada Highway Service Point',
        phone: '9825789012',
        city: 'Bharuch',
        state: 'Gujarat',
        address: 'NH-48 Bypass, Near Zadeshwar, Bharuch',
        specialization: 'Highway Emergency Breakdown',
        experienceYears: 13,
        rating: 4.6,
        reviewCount: 52,
        timing: 'Open 24 Hours',
        servicesOffered: ['Towing Assistance', 'Tire Puncture & Replacement', 'Jump Start', 'Express Repairs']
      }
    ];

    for (const m of gujaratMechanics) {
      let mech = await Mechanic.findOne({ phone: m.phone });
      if (!mech) {
        await Mechanic.create(m);
      } else {
        mech.city = m.city;
        mech.state = m.state;
        mech.shopName = m.shopName;
        mech.servicesOffered = m.servicesOffered;
        await mech.save();
      }
    }
    console.log(`✅ Verified Gujarat Mechanics seeded across ${gujaratMechanics.length} cities`);

    // ==========================================
    // 11. Verified Gujarat Driving Teachers
    // ==========================================
    const gujaratTeachers = [
      {
        name: 'Hasmukh Patel (Santram Motor Training School)',
        phone: '9879567890',
        email: 'santram.driving.nadiad@example.com',
        city: 'Nadiad',
        state: 'Gujarat',
        address: 'College Road, Opp. DDIT College, Nadiad',
        experienceYears: 14,
        hourlyRate: 350,
        vehicleType: 'Manual & Automatic',
        licenseType: 'LMV (Light Motor Vehicle)',
        rating: 4.9,
        reviewCount: 160,
        availability: 'Mon - Sat (6:30 AM - 7:30 PM)'
      },
      {
        name: 'Manoj Trivedi (Ahmedabad Motor Training School)',
        phone: '9879012345',
        email: 'trivedi.driving.ahd@example.com',
        city: 'Ahmedabad',
        state: 'Gujarat',
        address: 'University Road, Navrangpura, Ahmedabad',
        experienceYears: 12,
        hourlyRate: 400,
        vehicleType: 'Manual & Automatic',
        licenseType: 'LMV & Two Wheeler',
        rating: 4.9,
        reviewCount: 220,
        availability: 'Mon - Sun (7:00 AM - 8:00 PM)'
      },
      {
        name: 'Paresh Choksi (Diamond City Motor Academy)',
        phone: '9879123456',
        email: 'diamond.driving.surat@example.com',
        city: 'Surat',
        state: 'Gujarat',
        address: 'Athwa Lines, Near Chopati, Surat',
        experienceYears: 8,
        hourlyRate: 450,
        vehicleType: 'Manual & Automatic',
        licenseType: 'LMV Dual-Control',
        rating: 4.8,
        reviewCount: 135,
        availability: 'Mon - Sat (7:00 AM - 7:00 PM)'
      },
      {
        name: 'Nitin Bhatt (Baroda Defensive Driving School)',
        phone: '9879234567',
        email: 'baroda.driving@example.com',
        city: 'Vadodara',
        state: 'Gujarat',
        address: 'Fatehgunj Main Road, Vadodara',
        experienceYears: 10,
        hourlyRate: 420,
        vehicleType: 'Manual Transmission',
        licenseType: 'LMV & Heavy Vehicle',
        rating: 4.8,
        reviewCount: 115,
        availability: 'Mon - Sat (6:00 AM - 6:00 PM)'
      },
      {
        name: 'Ketan Jadeha (Rajkot Royal Motor Training)',
        phone: '9879345678',
        email: 'royal.driving.rajkot@example.com',
        city: 'Rajkot',
        state: 'Gujarat',
        address: 'Kalawad Road, Near KKV Hall, Rajkot',
        experienceYears: 15,
        hourlyRate: 380,
        vehicleType: 'Manual & Automatic',
        licenseType: 'LMV Certified',
        rating: 4.9,
        reviewCount: 180,
        availability: 'Mon - Sat (7:00 AM - 7:00 PM)'
      },
      {
        name: 'Sanjay Rawal (Capital Motor Training Academy)',
        phone: '9879456789',
        email: 'capital.driving.gn@example.com',
        city: 'Gandhinagar',
        state: 'Gujarat',
        address: 'Sector 21 Shopping Centre, Gandhinagar',
        experienceYears: 9,
        hourlyRate: 400,
        vehicleType: 'Automatic Special',
        licenseType: 'LMV Automatic & EV',
        rating: 4.7,
        reviewCount: 92,
        availability: 'Mon - Sat (7:00 AM - 7:00 PM)'
      },
      {
        name: 'Jayesh Patel (Amul City Driving School)',
        phone: '9879678901',
        email: 'amul.driving.anand@example.com',
        city: 'Anand',
        state: 'Gujarat',
        address: 'Near Anand Agricultural University Gate, Anand',
        experienceYears: 7,
        hourlyRate: 380,
        vehicleType: 'Manual & Automatic',
        licenseType: 'LMV',
        rating: 4.8,
        reviewCount: 78,
        availability: 'Mon - Sat (7:00 AM - 6:30 PM)'
      }
    ];

    for (const t of gujaratTeachers) {
      let teacher = await DrivingTeacher.findOne({ phone: t.phone });
      if (!teacher) {
        await DrivingTeacher.create(t);
      } else {
        teacher.city = t.city;
        teacher.state = t.state;
        teacher.name = t.name;
        teacher.hourlyRate = t.hourlyRate;
        await teacher.save();
      }
    }
    console.log(`✅ Verified Gujarat Driving Teachers seeded across ${gujaratTeachers.length} cities`);

    // ==========================================
    // 12. Verified Gujarat Locations (RTOs, Petrol Pumps, PUC Centers)
    // ==========================================
    const gujaratLocations = [
      {
        name: 'Kheda-Nadiad Regional Transport Office (RTO GJ-07)',
        type: 'RTO Office',
        city: 'Nadiad',
        state: 'Gujarat',
        address: 'Dharmist Road, Near Circuit House, Nadiad',
        latitude: 22.6916,
        longitude: 72.8634,
        phone: '0268-2550123',
        timing: '10:30 AM - 5:30 PM (Mon-Sat)',
        distanceKm: 2.1,
        rating: 4.5,
        services: ['Driving Licence', 'RC Transfer', 'Vehicle Fitness', 'HSRP Plates']
      },
      {
        name: 'Subhash Bridge Regional Transport Office (RTO GJ-01)',
        type: 'RTO Office',
        city: 'Ahmedabad',
        state: 'Gujarat',
        address: 'Near Subhash Bridge Circle, Sabarmati, Ahmedabad',
        latitude: 23.0617,
        longitude: 72.5833,
        phone: '079-27559123',
        timing: '10:30 AM - 5:30 PM (Mon-Sat)',
        distanceKm: 3.5,
        rating: 4.6,
        services: ['Driving Licence', 'Vehicle Registration', 'Permits', 'Green Tax']
      },
      {
        name: 'Vadodara Central RTO Office (RTO GJ-06)',
        type: 'RTO Office',
        city: 'Vadodara',
        state: 'Gujarat',
        address: 'Waghodia Road, Near Golden Chokdi, Vadodara',
        latitude: 22.3072,
        longitude: 73.1812,
        phone: '0265-2512345',
        timing: '10:30 AM - 5:30 PM',
        distanceKm: 4.0,
        rating: 4.4,
        services: ['RC Book Renewal', 'International Permit', 'Hypothecation Endorsement']
      },
      {
        name: 'Gujarat Gas CNG & Petrol Pump, Nadiad',
        type: 'Petrol Pump',
        city: 'Nadiad',
        state: 'Gujarat',
        address: 'Uttarsanda Road, NH-48 Cross, Nadiad',
        latitude: 22.6880,
        longitude: 72.8550,
        phone: '0268-2567890',
        timing: 'Open 24 Hours',
        distanceKm: 1.2,
        rating: 4.7,
        services: ['24x7 CNG Refill', 'Power Petrol', 'High Speed Diesel', 'Air & Nitrogen']
      },
      {
        name: 'Indian Oil Swastik Petroleum & Certified PUC Center',
        type: 'PUC Center',
        city: 'Nadiad',
        state: 'Gujarat',
        address: 'College Road, Opp. SP Stadium, Nadiad',
        latitude: 22.6940,
        longitude: 72.8610,
        phone: '0268-2589012',
        timing: '8:00 AM - 9:00 PM',
        distanceKm: 0.8,
        rating: 4.9,
        services: ['Online RTO Certified PUC', 'Petrol & Diesel Emission Test', 'Instant Certificate']
      }
    ];

    for (const loc of gujaratLocations) {
      let l = await Location.findOne({ name: loc.name });
      if (!l) {
        await Location.create(loc);
      } else {
        l.city = loc.city;
        l.state = loc.state;
        await l.save();
      }
    }
    console.log(`✅ Gujarat RTO, Petrol, and PUC locations seeded`);

    console.log('========================================================');
    console.log('🎉 GUJARAT SEEDING COMPLETED SUCCESSFULLY!');
    console.log(`👤 Demo User: Diya Patel (${diyaEmail} / user123)`);
    console.log(`🚗 Primary Vehicle: GJ07DK1616 (Maruti Suzuki Brezza CNG)`);
    console.log(`🛡️ Super Admin: admin@safarsaathi.com / admin123`);
    console.log('========================================================');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

seedGujaratDemo();
