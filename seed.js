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
  InsurancePlan,
  Loan,
  Mechanic,
  DrivingTeacher,
  Location,
  TrafficSign,
  Expense,
  ServiceMaintenance,
  Notification,
  ComplaintFeedback,
  Admin,
  VehicleSearch,
  FuelRecord
} = require('../models');

const seedData = async () => {
  try {
    console.log('Connecting to MongoDB for safe seeding...');
    await connectDB();

    console.log('Checking existing demo data (safe, non-destructive mode)...');

    // 1. Create Admins
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const userPassword = await bcrypt.hash('user123', salt);

    const adminEmail = 'admin@safarsaathi.com';
    let admin = await Admin.findOne({ email: adminEmail });
    if (!admin) {
      admin = await Admin.create({
        name: 'SafarSaathi Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'Super Admin',
        status: 'Active',
        lastLogin: new Date()
      });
      console.log(`✅ Admin created: ${adminEmail} / admin123`);
    } else {
      console.log(`ℹ️ Admin already exists: ${adminEmail}`);
    }

    // 2. Create Users
    const demoUsers = [
      {
        fullName: 'Rahul Sharma',
        email: 'rahul@safarsaathi.com',
        phone: '9876543210',
        password: userPassword,
        accountType: 'Individual',
        address: 'Flat 402, Green Glen Park, Aundh',
        city: 'Pune',
        state: 'Maharashtra',
        status: 'Active',
        role: 'User'
      },
      {
        fullName: 'Priya Singh',
        email: 'priya@safarsaathi.com',
        phone: '9876543211',
        password: userPassword,
        accountType: 'Business',
        address: '12, Sunrise Residency, Navrangpura',
        city: 'Ahmedabad',
        state: 'Gujarat',
        status: 'Active',
        role: 'User'
      },
      {
        fullName: 'Amit Verma',
        email: 'amit@safarsaathi.com',
        phone: '9876543212',
        password: userPassword,
        address: 'B-204, Palm Springs, Thane West',
        city: 'Mumbai',
        state: 'Maharashtra',
        status: 'Inactive',
        role: 'User'
      },
      {
        fullName: 'Neha Patel',
        email: 'neha@safarsaathi.com',
        phone: '9876543213',
        password: userPassword,
        address: '55, Crystal Heights, Adajan',
        city: 'Surat',
        state: 'Gujarat',
        status: 'Active',
        role: 'User'
      }
    ];

    const usersMap = {};
    for (const uData of demoUsers) {
      let u = await User.findOne({ email: uData.email });
      if (!u) {
        u = await User.create(uData);
        console.log(`✅ User created: ${u.email}`);
      } else {
        console.log(`ℹ️ User already exists: ${u.email}`);
      }
      usersMap[u.email] = u;
    }

    const rahul = usersMap['rahul@safarsaathi.com'];
    const priya = usersMap['priya@safarsaathi.com'];
    const amit = usersMap['amit@safarsaathi.com'];
    const neha = usersMap['neha@safarsaathi.com'];

    // 3. Create Vehicles
    const demoVehicles = [
      {
        userId: rahul._id,
        vehicleNumber: 'MH12 AB 1234',
        ownerName: 'Rahul Sharma',
        city: 'Pune',
        state: 'Maharashtra',
        phoneNumber: '9876543210',
        vehicleType: '4 Wheeler',
        brand: 'Maruti Suzuki',
        model: 'Swift VXi',
        fuelType: 'Petrol',
        chassisNumber: 'MB1AJB3C4D5E67890',
        registrationDate: new Date('2018-01-10'),
        insuranceStartDate: new Date('2024-08-15'),
        insuranceExpiryDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // 25 days left
        pucExpiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days left
        status: 'Active'
      },
      {
        userId: rahul._id,
        vehicleNumber: 'KA05 XY 5678',
        ownerName: 'Rahul Sharma',
        city: 'Pune',
        state: 'Maharashtra',
        phoneNumber: '9876543210',
        vehicleType: '4 Wheeler',
        brand: 'Hyundai',
        model: 'Creta SX',
        fuelType: 'Diesel',
        chassisNumber: 'MALC1234567890DEF',
        registrationDate: new Date('2020-03-15'),
        insuranceStartDate: new Date('2024-05-10'),
        insuranceExpiryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days left
        pucExpiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        status: 'Active'
      },
      {
        userId: rahul._id,
        vehicleNumber: 'DL08 CD 9876',
        ownerName: 'Rahul Sharma',
        city: 'Pune',
        state: 'Maharashtra',
        phoneNumber: '9876543210',
        vehicleType: '4 Wheeler',
        brand: 'Honda',
        model: 'City ZX',
        fuelType: 'Petrol',
        chassisNumber: 'MAK3456789012XYZ',
        registrationDate: new Date('2019-11-20'),
        insuranceStartDate: new Date('2023-01-01'),
        insuranceExpiryDate: new Date('2024-01-01'), // Expired
        pucExpiryDate: new Date('2024-02-15'),
        status: 'Active'
      },
      {
        userId: priya._id,
        vehicleNumber: 'GJ01 KL 1111',
        ownerName: 'Priya Singh',
        city: 'Ahmedabad',
        state: 'Gujarat',
        phoneNumber: '9876543211',
        vehicleType: '4 Wheeler',
        brand: 'Tata',
        model: 'Nexon EV',
        fuelType: 'Electric',
        chassisNumber: 'MAT6789012345ABC',
        registrationDate: new Date('2022-07-20'),
        insuranceStartDate: new Date('2024-07-20'),
        insuranceExpiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
        status: 'Active'
      }
    ];

    const vehiclesMap = {};
    for (const vData of demoVehicles) {
      let v = await Vehicle.findOne({ vehicleNumber: vData.vehicleNumber });
      if (!v) {
        v = await Vehicle.create(vData);
        console.log(`✅ Vehicle created: ${v.vehicleNumber}`);
      } else {
        console.log(`ℹ️ Vehicle already exists: ${v.vehicleNumber}`);
      }
      vehiclesMap[v.vehicleNumber] = v;
    }

    const swift = vehiclesMap['MH12 AB 1234'];
    const creta = vehiclesMap['KA05 XY 5678'];

    // 4. Vehicle Documents for Swift
    const demoDocs = [
      {
        vehicleId: swift._id,
        userId: rahul._id,
        documentType: 'RC Book',
        documentName: 'RC Book (Registration Certificate)',
        fileUrl: '/uploads/rc-book-sample.pdf',
        status: 'Uploaded'
      },
      {
        vehicleId: swift._id,
        userId: rahul._id,
        documentType: 'Insurance',
        documentName: 'Comprehensive Insurance Policy Document',
        fileUrl: '/uploads/insurance-policy-sample.pdf',
        status: 'Uploaded'
      },
      {
        vehicleId: swift._id,
        userId: rahul._id,
        documentType: 'PUC',
        documentName: 'Pollution Under Control (PUC) Certificate',
        fileUrl: '/uploads/puc-certificate-sample.pdf',
        status: 'Uploaded'
      },
      {
        vehicleId: swift._id,
        userId: rahul._id,
        documentType: 'Driving Licence',
        documentName: 'Driving Licence (Rahul Sharma)',
        fileUrl: '/uploads/driving-licence-sample.pdf',
        status: 'Uploaded'
      }
    ];

    for (const doc of demoDocs) {
      const exists = await VehicleDocument.findOne({
        vehicleId: doc.vehicleId,
        documentType: doc.documentType
      });
      if (!exists) {
        await VehicleDocument.create(doc);
      }
    }
    console.log('✅ Vehicle documents verified/created.');

    // 4b. Fuel Records for Swift
    const demoFuelRecords = [
      {
        userId: rahul._id,
        vehicleId: swift._id,
        fuelType: 'Petrol',
        fuelQuantity: 30,
        fuelCost: 3120,
        odometerReading: 41200,
        fuelDate: new Date('2024-03-01'),
        fuelStation: 'HP Auto Fuel Centre, Aundh',
        notes: 'Initial full tank refill (Baseline)',
        distanceTravelled: 0,
        calculatedMileage: 0
      },
      {
        userId: rahul._id,
        vehicleId: swift._id,
        fuelType: 'Petrol',
        fuelQuantity: 28,
        fuelCost: 2912,
        odometerReading: 41650,
        fuelDate: new Date('2024-03-18'),
        fuelStation: 'Indian Oil Retail Outlet, FC Road',
        notes: 'Full tank refill',
        distanceTravelled: 450,
        calculatedMileage: 16.07
      },
      {
        userId: rahul._id,
        vehicleId: swift._id,
        fuelType: 'Petrol',
        fuelQuantity: 27,
        fuelCost: 2808,
        odometerReading: 42120,
        fuelDate: new Date('2024-04-05'),
        fuelStation: 'Bharat Petroleum Highway, Baner',
        notes: 'Highway trip refill',
        distanceTravelled: 470,
        calculatedMileage: 17.41
      }
    ];

    for (const fr of demoFuelRecords) {
      const exists = await FuelRecord.findOne({
        vehicleId: fr.vehicleId,
        odometerReading: fr.odometerReading
      });
      if (!exists) {
        await FuelRecord.create(fr);
      }
    }
    console.log('✅ Fuel records verified/created.');

    // 5. Insurance Plans
    const demoPlans = [
      {
        companyName: 'HDFC ERGO General Insurance',
        planName: 'Comprehensive Motor Protection',
        coverageAmount: 500000,
        premiumAmount: 12421,
        planType: 'Comprehensive',
        features: ['Zero Depreciation', '24x7 Roadside Assistance', 'Engine Protection', 'Consumables Cover'],
        duration: '1 Year',
        rating: 4.8,
        claimSettlementRatio: '98.5%'
      },
      {
        companyName: 'ICICI Lombard',
        planName: 'Secure Drive Plus',
        coverageAmount: 500000,
        premiumAmount: 11876,
        planType: 'Comprehensive',
        features: ['Cashless Garages (5,000+)', 'Key Replacement', 'Tyre Damage Cover', 'Personal Accident Cover'],
        duration: '1 Year',
        rating: 4.6,
        claimSettlementRatio: '97.6%'
      },
      {
        companyName: 'Bajaj Allianz',
        planName: 'Total Protect Car Insurance',
        coverageAmount: 500000,
        premiumAmount: 10910,
        planType: 'Standard',
        features: ['Third-Party Liability', 'Theft Protection', 'Natural Calamities Cover', '24x7 Towing Assistance'],
        duration: '1 Year',
        rating: 4.5,
        claimSettlementRatio: '96.8%'
      },
      {
        companyName: 'SBI General Insurance',
        planName: 'Smart Car Protection Plan',
        coverageAmount: 500000,
        premiumAmount: 11245,
        planType: 'Comprehensive',
        features: ['Quick Paperless Claim', 'Roadside Assistance', 'Hospital Daily Cash', 'Return to Invoice'],
        duration: '1 Year',
        rating: 4.4,
        claimSettlementRatio: '95.2%'
      },
      {
        companyName: 'Tata AIG',
        planName: 'Auto Secure Bumper to Bumper',
        coverageAmount: 600000,
        premiumAmount: 13500,
        planType: 'Zero Depreciation',
        features: ['Zero Dep Full Claim', 'NCB Retention', 'Emergency Hotel Accommodation', 'Glass Cover'],
        duration: '1 Year',
        rating: 4.9,
        claimSettlementRatio: '99.0%'
      }
    ];

    for (const plan of demoPlans) {
      const exists = await InsurancePlan.findOne({
        companyName: plan.companyName,
        planName: plan.planName
      });
      if (!exists) {
        await InsurancePlan.create(plan);
      }
    }
    console.log('✅ Insurance plans verified/created.');

    // 6. Active Insurance for Swift
    const activePolicyNumber = 'HDFC-ERGO-98765432';
    const insExists = await Insurance.findOne({ policyNumber: activePolicyNumber });
    if (!insExists) {
      await Insurance.create({
        vehicleId: swift._id,
        userId: rahul._id,
        policyNumber: activePolicyNumber,
        companyName: 'HDFC ERGO General Insurance',
        planName: 'Comprehensive Motor Protection',
        coverageAmount: 500000,
        premiumAmount: 12421,
        startDate: new Date('2024-08-15'),
        expiryDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        status: 'Active'
      });
    }
    console.log('✅ Active Insurance policy verified/created.');

    // 7. Loan Application for Creta
    const loanExists = await Loan.findOne({
      userId: rahul._id,
      vehicleId: creta._id,
      bankName: 'HDFC Bank'
    });
    if (!loanExists) {
      await Loan.create({
        userId: rahul._id,
        vehicleId: creta._id,
        loanAmount: 450000,
        tenureMonths: 36,
        employmentType: 'Salaried',
        monthlyIncome: 85000,
        bankName: 'HDFC Bank',
        interestRate: 8.5,
        estimatedEmi: 14210,
        status: 'Approved',
        remarks: 'Approved at 8.5% interest rate for 36 months.',
        appliedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      });
    }
    console.log('✅ Loan record verified/created.');

    // 8. Mechanics
    const demoMechanics = [
      {
        name: 'Ramesh Sharma',
        shopName: 'Sharma Auto Service',
        phone: '9876543210',
        specialization: 'General Service, Repair & Tuning',
        experienceYears: 12,
        rating: 4.5,
        reviewCount: 120,
        address: 'Plot 14, Near FC College, Shivaji Nagar',
        city: 'Pune',
        state: 'Maharashtra',
        distanceKm: 0.8,
        latitude: 18.5308,
        longitude: 73.8475,
        timing: '8:30 AM - 8:30 PM',
        servicesOffered: ['General Service', 'Engine Tuning', 'Oil Change', 'Brake Pad Replacement']
      },
      {
        name: 'Vikas Kadam',
        shopName: 'Speedy Motors',
        phone: '9876543211',
        specialization: 'Multi-Brand Service & Diagnostics',
        experienceYears: 8,
        rating: 4.2,
        reviewCount: 85,
        address: 'Survey 42, Paud Road, Kothrud',
        city: 'Pune',
        state: 'Maharashtra',
        distanceKm: 1.2,
        latitude: 18.5074,
        longitude: 73.8077,
        timing: '9:00 AM - 9:00 PM',
        servicesOffered: ['Computer Diagnostics', 'AC Service', 'Wheel Alignment', 'Suspension Overhaul']
      },
      {
        name: 'Irfan Sheikh',
        shopName: 'City Car Care',
        phone: '9876543212',
        specialization: 'Engine, AC, Electrical & Denting',
        experienceYears: 15,
        rating: 4.8,
        reviewCount: 210,
        address: 'Shop 7, High Street, Baner',
        city: 'Pune',
        state: 'Maharashtra',
        distanceKm: 2.0,
        latitude: 18.5590,
        longitude: 73.7868,
        timing: '8:00 AM - 8:00 PM',
        servicesOffered: ['AC Gas Refill', 'Dent Removal', 'Paint Polish', 'Engine Overhaul']
      },
      {
        name: 'Sunil Jagtap',
        shopName: 'Apex Tyres & Wheel Alignment',
        phone: '9876543213',
        specialization: 'Tyres, Balancing & Nitrogen',
        experienceYears: 6,
        rating: 4.6,
        reviewCount: 95,
        address: 'Bremmen Square, Aundh',
        city: 'Pune',
        state: 'Maharashtra',
        distanceKm: 3.1,
        latitude: 18.5626,
        longitude: 73.8087,
        timing: '9:00 AM - 9:30 PM',
        servicesOffered: ['Laser Wheel Alignment', 'Wheel Balancing', 'Tubeless Puncture', 'Nitrogen Air']
      }
    ];

    for (const mech of demoMechanics) {
      const exists = await Mechanic.findOne({
        shopName: mech.shopName,
        phone: mech.phone
      });
      if (!exists) {
        await Mechanic.create(mech);
      }
    }
    console.log('✅ Mechanics verified/created.');

    // 9. Driving Teachers
    const demoTeachers = [
      {
        name: 'Amit Driving School',
        phone: '9822012345',
        email: 'amit.drivingschool@safarsaathi.com',
        experienceYears: 6,
        vehicleType: 'Manual & Automatic',
        licenseType: 'LMV (Light Motor Vehicle)',
        address: 'Shop 3, Main Market, Shivaji Nagar',
        city: 'Pune',
        state: 'Maharashtra',
        availability: 'Mon - Sun (6:00 AM - 7:00 PM)',
        rating: 4.7,
        reviewCount: 108,
        hourlyRate: 450
      },
      {
        name: 'Safe Wheels Academy',
        phone: '9822023456',
        email: 'safewheels@safarsaathi.com',
        experienceYears: 8,
        vehicleType: 'Manual & Automatic',
        licenseType: 'LMV & MCWG (Two Wheeler)',
        address: 'Near Gandhi Bhavan, Kothrud',
        city: 'Pune',
        state: 'Maharashtra',
        availability: 'Mon - Sat (6:30 AM - 6:30 PM)',
        rating: 4.9,
        reviewCount: 150,
        hourlyRate: 500
      },
      {
        name: 'City Driving Classes',
        phone: '9822034567',
        email: 'citydriving@safarsaathi.com',
        experienceYears: 4,
        vehicleType: 'Manual & Automatic',
        licenseType: 'LMV (Light Motor Vehicle)',
        address: 'DP Road, Aundh',
        city: 'Pune',
        state: 'Maharashtra',
        availability: 'Daily (7:00 AM - 6:00 PM)',
        rating: 4.5,
        reviewCount: 85,
        hourlyRate: 400
      }
    ];

    for (const t of demoTeachers) {
      const exists = await DrivingTeacher.findOne({
        name: t.name,
        phone: t.phone
      });
      if (!exists) {
        await DrivingTeacher.create(t);
      }
    }
    console.log('✅ Driving teachers verified/created.');

    // 10. Locations / Services (Nearby Places)
    const demoLocations = [
      {
        name: 'Pune Central RTO Office (MH-12)',
        type: 'RTO Office',
        address: 'Dr. Ambedkar Road, Sangam Bridge, Pune',
        city: 'Pune',
        state: 'Maharashtra',
        latitude: 18.5292,
        longitude: 73.8643,
        phone: '020-26058080',
        timing: '10:00 AM - 5:30 PM (Mon-Fri)',
        distanceKm: 2.5,
        rating: 4.1,
        services: ['Learner Licence Test', 'Permanent Driving Licence', 'RC Transfer', 'Vehicle Fitness']
      },
      {
        name: 'Pimpri-Chinchwad RTO Office (MH-14)',
        type: 'RTO Office',
        address: 'Telco Road, Sector 6, Moshi Pradhikaran, PCMC',
        city: 'Pune',
        state: 'Maharashtra',
        latitude: 18.6671,
        longitude: 73.8422,
        phone: '020-27129595',
        timing: '10:00 AM - 5:30 PM (Mon-Fri)',
        distanceKm: 9.8,
        rating: 4.0,
        services: ['Vehicle Registration', 'Commercial Permits', 'Address Update', 'Driving Tests']
      },
      {
        name: 'HP Petrol Pump - AutoFuel 24/7',
        type: 'Petrol Pump',
        address: 'FC Road, Near Deccan Gymkhana, Pune',
        city: 'Pune',
        state: 'Maharashtra',
        latitude: 18.5204,
        longitude: 73.8436,
        phone: '020-25671122',
        timing: 'Open 24 Hours',
        distanceKm: 1.1,
        rating: 4.4,
        services: ['Petrol', 'Power Petrol', 'Diesel', 'Free Air', 'PUC Testing Unit']
      },
      {
        name: 'Indian Oil Petrol & CNG Station',
        type: 'Petrol Pump',
        address: 'Senapati Bapat Road, Shivaji Nagar, Pune',
        city: 'Pune',
        state: 'Maharashtra',
        latitude: 18.5350,
        longitude: 73.8320,
        phone: '020-25654321',
        timing: 'Open 24 Hours',
        distanceKm: 1.5,
        rating: 4.5,
        services: ['Petrol', 'CNG Dispenser', 'Diesel', 'Clean Water', 'Nitrogen Air']
      },
      {
        name: 'Bharat Petroleum Highway Express',
        type: 'Petrol Pump',
        address: 'Baner-Pashan Link Road, Baner, Pune',
        city: 'Pune',
        state: 'Maharashtra',
        latitude: 18.5590,
        longitude: 73.7868,
        phone: '020-27291100',
        timing: 'Open 24 Hours',
        distanceKm: 3.2,
        rating: 4.3,
        services: ['Speed Petrol', 'Diesel', 'Convenience Store', 'EV Charging Station']
      },
      {
        name: 'Sharma Auto Service Workshop',
        type: 'Mechanic',
        address: 'Plot 14, FC College Road, Shivaji Nagar, Pune',
        city: 'Pune',
        state: 'Maharashtra',
        latitude: 18.5308,
        longitude: 73.8475,
        phone: '9876543210',
        timing: '8:30 AM - 8:30 PM',
        distanceKm: 0.8,
        rating: 4.5,
        services: ['Emergency Breakdown Service', 'Engine Repair', 'Periodic Maintenance']
      }
    ];

    for (const loc of demoLocations) {
      const exists = await Location.findOne({ name: loc.name });
      if (!exists) {
        await Location.create(loc);
      }
    }
    console.log('✅ Locations verified/created.');

    // 11. Traffic Signs
    const demoSigns = [
      {
        name: 'Stop',
        category: 'Regulatory',
        meaning: 'Bring vehicle to complete halt before stop line',
        description: 'Mandatory sign requiring driver to stop vehicle completely and give way to oncoming traffic.',
        symbol: 'STOP',
        code: 'REG-01',
        shape: 'Octagon',
        color: 'Red'
      },
      {
        name: 'No Entry',
        category: 'Regulatory',
        meaning: 'Strictly prohibited from entering',
        description: 'Indicates road or section is one-way or restricted; entry of all vehicles is prohibited.',
        symbol: 'NO_ENTRY',
        code: 'REG-02',
        shape: 'Circle',
        color: 'Red'
      },
      {
        name: 'Speed Limit 30',
        category: 'Regulatory',
        meaning: 'Maximum speed limit is 30 km/h',
        description: 'Strict speed restriction zone. Driving above 30 km/h is a punishable traffic violation.',
        symbol: '30',
        code: 'REG-03',
        shape: 'Circle',
        color: 'Red'
      },
      {
        name: 'No Parking',
        category: 'Regulatory',
        meaning: 'Parking of vehicles is strictly forbidden',
        description: 'Vehicles must not be parked on this roadway. Violations may attract towing and fines.',
        symbol: 'NO_PARKING',
        code: 'REG-04',
        shape: 'Circle',
        color: 'Red'
      },
      {
        name: 'Pedestrian Crossing',
        category: 'Warning',
        meaning: 'Zebra crossing ahead, watch for pedestrians',
        description: 'Warns drivers of approaching zebra crossing. Drivers must slow down and allow pedestrians to cross safely.',
        symbol: 'PEDESTRIAN',
        code: 'WARN-01',
        shape: 'Triangle',
        color: 'Yellow'
      },
      {
        name: 'U-Turn',
        category: 'Informative',
        meaning: 'U-Turn allowed ahead',
        description: 'Designates safe point on roadway where vehicles are permitted to make 180-degree turnaround.',
        symbol: 'U_TURN',
        code: 'INFO-01',
        shape: 'Rectangle',
        color: 'Blue'
      },
      {
        name: 'Speed Hump',
        category: 'Warning',
        meaning: 'Speed breaker / hump on road ahead',
        description: 'Warns of road hump ahead. Slow down to avoid vehicle underbody scrape and passenger shock.',
        symbol: 'HUMP',
        code: 'WARN-02',
        shape: 'Triangle',
        color: 'Yellow'
      },
      {
        name: 'Slippery Road',
        category: 'Warning',
        meaning: 'Road surface may be slippery ahead',
        description: 'Wet road, gravel or smooth asphalt ahead may reduce tyre traction. Avoid hard braking.',
        symbol: 'SLIPPERY',
        code: 'WARN-03',
        shape: 'Triangle',
        color: 'Yellow'
      },
      {
        name: 'Road Narrows',
        category: 'Warning',
        meaning: 'Roadway width decreases ahead',
        description: 'Warns that carriage width narrows ahead. Maintain lane discipline and moderate speed.',
        symbol: 'NARROWS',
        code: 'WARN-04',
        shape: 'Triangle',
        color: 'Yellow'
      },
      {
        name: 'Traffic Signal',
        category: 'Warning',
        meaning: 'Automated traffic control signal ahead',
        description: 'Warns that traffic signal lights are ahead at approaching junction. Prepare to stop if red.',
        symbol: 'SIGNAL',
        code: 'WARN-05',
        shape: 'Triangle',
        color: 'Yellow'
      }
    ];

    for (const sign of demoSigns) {
      const exists = await TrafficSign.findOne({ code: sign.code });
      if (!exists) {
        await TrafficSign.create(sign);
      }
    }
    console.log('✅ Traffic signs verified/created.');

    // 12. Expenses for Rahul / Swift
    const demoExpenses = [
      {
        userId: rahul._id,
        vehicleId: swift._id,
        category: 'Fuel',
        amount: 1300,
        description: 'Petrol Refill (IOCL FC Road)',
        date: new Date('2024-05-05'),
        paymentMethod: 'UPI'
      },
      {
        userId: rahul._id,
        vehicleId: swift._id,
        category: 'Service',
        amount: 3500,
        description: 'General Periodic Service at Sharma Auto',
        date: new Date('2024-05-02'),
        paymentMethod: 'UPI'
      },
      {
        userId: rahul._id,
        vehicleId: swift._id,
        category: 'Repair',
        amount: 1800,
        description: 'Brake Pad Change & Disc Cleaning',
        date: new Date('2024-04-25'),
        paymentMethod: 'Debit Card'
      },
      {
        userId: rahul._id,
        vehicleId: swift._id,
        category: 'Insurance',
        amount: 5330,
        description: 'Insurance Premium Installment (HDFC ERGO)',
        date: new Date('2024-04-20'),
        paymentMethod: 'Net Banking'
      },
      {
        userId: rahul._id,
        vehicleId: swift._id,
        category: 'Others',
        amount: 500,
        description: 'Interior Vacuuming & Foam Car Wash',
        date: new Date('2024-04-10'),
        paymentMethod: 'Cash'
      }
    ];

    for (const exp of demoExpenses) {
      const exists = await Expense.findOne({
        userId: exp.userId,
        vehicleId: exp.vehicleId,
        description: exp.description,
        date: exp.date
      });
      if (!exists) {
        await Expense.create(exp);
      }
    }
    console.log('✅ Expenses verified/created.');

    // 13. Service & Maintenance for Rahul / Swift
    const demoServices = [
      {
        userId: rahul._id,
        vehicleId: swift._id,
        serviceType: 'General Service',
        serviceDate: new Date('2024-02-10'),
        nextServiceDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // Next service in 15 days
        mileage: 42500,
        cost: 2500,
        description: 'Engine Oil Change (5W30) & Air Filter Replacement',
        serviceCenter: 'Sharma Auto Service, Pune',
        status: 'Completed'
      },
      {
        userId: rahul._id,
        vehicleId: swift._id,
        serviceType: 'General Service',
        serviceDate: new Date('2023-08-10'),
        nextServiceDate: new Date('2024-02-10'),
        mileage: 36200,
        cost: 2300,
        description: 'Synthetic Oil Change & Coolant Top Up',
        serviceCenter: 'Sharma Auto Service, Pune',
        status: 'Completed'
      },
      {
        userId: rahul._id,
        vehicleId: swift._id,
        serviceType: 'Full Service',
        serviceDate: new Date('2023-04-10'),
        nextServiceDate: new Date('2023-08-10'),
        mileage: 31000,
        cost: 3400,
        description: 'Comprehensive 30k Major Service Inspection',
        serviceCenter: 'Speedy Motors, Kothrud',
        status: 'Completed'
      },
      {
        userId: rahul._id,
        vehicleId: swift._id,
        serviceType: 'General Service',
        serviceDate: new Date('2024-04-20'),
        nextServiceDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        mileage: 44000,
        cost: 5500,
        description: 'Brake Fluid Flush & AC Cabin Filter Replacement',
        serviceCenter: 'City Car Care, Baner',
        status: 'Completed'
      },
      {
        userId: rahul._id,
        vehicleId: swift._id,
        serviceType: 'Periodic Maintenance',
        serviceDate: new Date(),
        nextServiceDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        mileage: 46000,
        cost: 2800,
        description: 'Upcoming Scheduled Periodic Checkup',
        serviceCenter: 'Sharma Auto Service, Pune',
        status: 'Upcoming'
      }
    ];

    for (const s of demoServices) {
      const exists = await ServiceMaintenance.findOne({
        userId: s.userId,
        vehicleId: s.vehicleId,
        description: s.description,
        serviceDate: s.serviceDate
      });
      if (!exists) {
        await ServiceMaintenance.create(s);
      }
    }
    console.log('✅ Service records verified/created.');

    // 14. Notifications for Rahul
    const demoNotifications = [
      {
        userId: rahul._id,
        vehicleId: swift._id,
        title: 'Insurance Expiry Reminder',
        message: 'Your insurance for Maruti Suzuki Swift (MH12 AB 1234) is expiring soon.',
        type: 'Insurance Expiry',
        daysLeft: 25,
        dueDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        isRead: false
      },
      {
        userId: rahul._id,
        vehicleId: swift._id,
        title: 'PUC Certificate Expiry',
        message: 'Your PUC certificate for MH12 AB 1234 is expiring in 60 days.',
        type: 'PUC Expiry',
        daysLeft: 60,
        dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        isRead: false
      },
      {
        userId: rahul._id,
        vehicleId: swift._id,
        title: 'Periodic Vehicle Service Reminder',
        message: 'Your vehicle service is due in 15 days at Sharma Auto Service.',
        type: 'Service Reminder',
        daysLeft: 15,
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        isRead: false
      },
      {
        userId: rahul._id,
        title: 'Driving Licence Expiry Notice',
        message: 'Your driving licence (MH-12-2018-004581) is valid and expiring in 651 days.',
        type: 'Licence Expiry',
        daysLeft: 651,
        dueDate: new Date('2026-02-20'),
        isRead: false
      }
    ];

    for (const notif of demoNotifications) {
      const exists = await Notification.findOne({
        userId: notif.userId,
        title: notif.title,
        type: notif.type
      });
      if (!exists) {
        await Notification.create(notif);
      }
    }
    console.log('✅ Notifications verified/created.');

    // 15. Complaints & Feedback
    const demoComplaints = [
      {
        userId: rahul._id,
        subject: 'Mobile App and Portal Feedback',
        message: 'App is very useful and saved my time on insurance renewal and service tracking!',
        type: 'Feedback',
        status: 'Resolved',
        adminResponse: 'Thank you for your valuable feedback, Rahul! Glad you had a great experience.',
        resolutionDate: new Date()
      },
      {
        userId: priya._id,
        subject: 'Insurance Plans Variety',
        message: 'Need more insurance options for electric vehicles and fast roadside claims.',
        type: 'Feedback',
        status: 'Open'
      },
      {
        userId: amit._id,
        subject: 'Mechanic Availability in Thane',
        message: 'Mechanic not available on Sunday near Thane West branch.',
        type: 'Complaint',
        status: 'In Progress',
        adminResponse: 'We are onboarding more certified mechanics in Thane West with 24/7 emergency service.'
      },
      {
        userId: neha._id,
        subject: 'Driving School Experience',
        message: 'Great experience with driving teacher listing and hassle-free scheduling!',
        type: 'Feedback',
        status: 'Resolved',
        adminResponse: 'Thank you for choosing SafarSaathi driving instructor partners.',
        resolutionDate: new Date()
      }
    ];

    for (const c of demoComplaints) {
      const exists = await ComplaintFeedback.findOne({
        userId: c.userId,
        subject: c.subject
      });
      if (!exists) {
        await ComplaintFeedback.create(c);
      }
    }
    console.log('✅ Complaints & feedback verified/created.');

    // 16. Vehicle Search Records
    const demoSearches = [
      {
        vehicleNumber: 'MH12 AB 1234',
        ownerName: 'Rahul Sharma',
        vehicleType: '4 Wheeler',
        brand: 'Maruti Suzuki',
        model: 'Swift VXi',
        fuelType: 'Petrol',
        registrationCity: 'Pune',
        registrationState: 'Maharashtra',
        registrationDate: new Date('2018-01-10'),
        chassisNumber: 'MB1AJB3C4D5E67890',
        engineNumber: 'K12M1234567',
        insuranceValidity: 'Active',
        pucValidity: 'Valid',
        status: 'Active'
      },
      {
        vehicleNumber: 'KA05 XY 5678',
        ownerName: 'Rahul Sharma',
        vehicleType: '4 Wheeler',
        brand: 'Hyundai',
        model: 'Creta SX',
        fuelType: 'Diesel',
        registrationCity: 'Bengaluru',
        registrationState: 'Karnataka',
        registrationDate: new Date('2020-03-15'),
        chassisNumber: 'MALC1234567890DEF',
        engineNumber: 'U2CRDI987654',
        insuranceValidity: 'Active',
        pucValidity: 'Valid',
        status: 'Active'
      },
      {
        vehicleNumber: 'DL08 CD 9876',
        ownerName: 'Rahul Sharma',
        vehicleType: '4 Wheeler',
        brand: 'Honda',
        model: 'City ZX',
        fuelType: 'Petrol',
        registrationCity: 'New Delhi',
        registrationState: 'Delhi',
        registrationDate: new Date('2019-11-20'),
        chassisNumber: 'MAK3456789012XYZ',
        engineNumber: 'IVTEC554433',
        insuranceValidity: 'Expired',
        pucValidity: 'Expired',
        status: 'Active'
      },
      {
        vehicleNumber: 'GJ01 KL 1111',
        ownerName: 'Priya Singh',
        vehicleType: '4 Wheeler',
        brand: 'Tata',
        model: 'Nexon EV',
        fuelType: 'Electric',
        registrationCity: 'Ahmedabad',
        registrationState: 'Gujarat',
        registrationDate: new Date('2022-07-20'),
        chassisNumber: 'MAT6789012345ABC',
        engineNumber: 'EVZIPTRON7788',
        insuranceValidity: 'Active',
        pucValidity: 'Exempt (Electric)',
        status: 'Active'
      }
    ];

    for (const s of demoSearches) {
      const exists = await VehicleSearch.findOne({
        vehicleNumber: s.vehicleNumber
      });
      if (!exists) {
        await VehicleSearch.create(s);
      }
    }
    console.log('✅ Vehicle search records verified/created.');

    console.log('\n===========================================');
    console.log('🎉 SafarSaathi Safe Seeding Complete!');
    console.log('===========================================');
    console.log('Default Admin Account:');
    console.log('  Email:    admin@safarsaathi.com');
    console.log('  Password: admin123');
    console.log('Default User Account:');
    console.log('  Email:    rahul@safarsaathi.com');
    console.log('  Password: user123');
    console.log('Existing User Accounts Preserved (e.g. Diya Patel).');
    console.log('===========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
