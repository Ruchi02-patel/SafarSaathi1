# SafarSaathi – Smart Vehicle Management and Maintenance System

---

## 1. Project Name
**SafarSaathi – Smart Vehicle Management and Maintenance System**  
An MCA Academic Project built with HTML, CSS, Vanilla JavaScript, Node.js, Express.js, MongoDB, and Mongoose.

---

## 2. Project Introduction
**SafarSaathi** (meaning *"Travel Companion"*) is a comprehensive web-based automotive management platform developed to simplify vehicle ownership. 

Vehicle owners typically face problems remembering renewal dates for pollution certificates (PUC), insurance policies, and periodic maintenance schedules. In addition, tracking fuel expenses, monitoring vehicle mileage, locating emergency roadside assistance, and storing vehicle registration documents (RC) safely in one place is difficult. 

SafarSaathi solves these everyday issues through a single, easy-to-use digital platform that supports individual vehicle owners, fleet managers, and system administrators.

---

## 3. Project Objectives
The main objectives of the SafarSaathi project are:
1. **Centralized Vehicle Records:** Store all vehicle details (registration number, chassis number, engine number, brand, model, fuel type) in a single database.
2. **Digital Document Locker:** Securely upload and retrieve digital copies of RC, PUC, Insurance, and Driving License.
3. **Automated Reminders:** Alert vehicle owners about upcoming document expiry dates and scheduled services.
4. **Fuel & Mileage Tracking:** Help owners calculate accurate vehicle mileage and identify fuel consumption patterns.
5. **Expense Management:** Track vehicle expenses (fuel, repairs, insurance, tolls, parking) with clear category-wise cost breakdowns.
6. **Emergency Roadside Services:** Provide contact information for nearby certified mechanics, 24/7 petrol pumps, PUC centers, and EV charging stations.
7. **Road Safety Awareness:** Educate drivers with interactive catalogs of Mandatory, Cautionary, and Informatory traffic signs.
8. **Administrative Governance:** Give administrators tools to monitor registered users, manage service directories, review complaints, and view analytical reports.

---

## 4. Main Features

### 👤 Citizen / Vehicle Owner Features:
* **User Authentication:** Secure registration and login with encrypted password storage.
* **Vehicle Dashboard:** Overview of total vehicles, active insurance policies, monthly expenses, and alerts.
* **Vehicle Management:** Add, view, edit, and delete 2-Wheelers, 4-Wheelers, Commercial, and Heavy Vehicles.
* **Document Vault:** Upload documents with issue and expiry dates; automatic status calculation (Valid, Expiring Soon, Expired).
* **Fuel & Mileage Log:** Record fuel fill-ups (fuel quantity, odometer reading, cost) with automatic mileage calculation in km/l.
* **Service & Maintenance:** Log maintenance records (oil change, brake pads, tire rotation) and set upcoming service alerts.
* **Expense Tracker:** Log all vehicle costs with category filters and monthly spending totals.
* **Insurance & Loans:** Browse insurance plans, track active policies, and calculate monthly car loan EMI with an interactive calculator.
* **Nearby Services:** Find nearby mechanics, petrol pumps, PUC centers, and driving schools with contact numbers.
* **Traffic Signs Guide:** Interactive guide for 50+ traffic and road safety signs.
* **RTO Vehicle Search:** Quick search tool to verify registered vehicle details.
* **Complaints & Feedback:** Submit feedback or report road/vehicle grievances.

### 🛡️ Administrator Features:
* **Admin Dashboard:** Real-time statistics on total registered users, fleet vehicles, loans, and grievances.
* **User Management:** View all user accounts, filter by role/account type, and update status (Active/Blocked).
* **Vehicle Monitoring:** View all vehicles registered in the system with owner contact information.
* **Service & Directory Management:** Add, update, or remove verified mechanics, driving instructors, and location centers.
* **Complaint Resolution:** Review user complaints and update status (Pending, Under Review, Resolved).
* **Financial & Analytical Reports:** Generate analytical reports on fleet expenses and revenue.

---

## 5. User Roles

| User Role | Description | Access Level |
| :--- | :--- | :--- |
| **Individual Vehicle Owner** | Personal car or bike owners managing their own vehicles, fuel, and documents. | Citizen Portal (`/dashboard`) |
| **Business / Fleet Owner** | Commercial fleet operators managing multiple company vehicles, fleet-wide expenses, and driver records. | Citizen Portal (`/dashboard`) |
| **System Administrator** | College faculty / platform admin managing master records, approving mechanics, and reviewing system reports. | Admin Console (`/admin/dashboard`) |

---

## 6. Technologies Used

### Frontend:
* **HTML5:** Semantic page layouts, accessible forms, data tables, and modal dialogs.
* **CSS3:** Custom responsive layout (`/css/styles.css`), clean color scheme, cards, badges, and status indicators.
* **Vanilla JavaScript:** Client-side form validation, dynamic DOM rendering, and asynchronous API calls using the `Fetch API`.

### Backend:
* **Node.js:** JavaScript runtime environment for executing server-side code.
* **Express.js:** Lightweight web server framework handling HTTP routing, REST API endpoints, and static file serving.
* **Multer:** Middleware for handling multipart file uploads (documents and photos).
* **JSON Web Token (JWT):** Stateless token-based user authentication.
* **bcrypt:** Cryptographic library used for hashing and salting user passwords.

### Database:
* **MongoDB:** NoSQL document database storing JSON-like BSON documents.
* **Mongoose:** Object Data Modeling (ODM) library providing schema validation, field types, and query helpers.
* **Embedded MongoDB Server:** Built-in automatic fallback that allows the application to run even if a standalone MongoDB Windows service is not installed.

---

## 7. Project Folder Structure

```
SafarSaathi-Vehicle Management System/
│
├── config/
│   └── db.js                       # MongoDB connection logic with embedded fallback
│
├── controllers/                    # Business logic functions for each module
│   ├── admin.controller.js          # Admin dashboard & management logic
│   ├── auth.controller.js           # Register, login, & token generation
│   ├── complaints.controller.js    # Grievance submission and status updates
│   ├── documents.controller.js     # Document upload and expiry status
│   ├── driving-teachers.controller.js # Driving instructor directory
│   ├── expenses.controller.js      # Expense recording and totals
│   ├── fuel.controller.js          # Fuel log and mileage calculation
│   ├── health.controller.js        # Health check endpoint
│   ├── insurance.controller.js     # Insurance plans and policy records
│   ├── loans.controller.js         # Loan records and EMI calculator
│   ├── locations.controller.js     # Nearby facilities (pumps, PUC, EV)
│   ├── mechanics.controller.js     # Mechanic directory
│   ├── notifications.controller.js # Expiry & maintenance reminder alerts
│   ├── services.controller.js      # Vehicle maintenance logs
│   ├── traffic-signs.controller.js # Traffic signs database
│   ├── users.controller.js         # User profile update
│   ├── vehicle-search.controller.js# RTO vehicle verification search
│   └── vehicles.controller.js      # Add, list, edit, delete vehicles
│
├── middleware/
│   ├── auth.middleware.js          # JWT token verification & admin role check
│   └── upload.middleware.js        # Multer configuration for file uploads
│
├── models/                         # Mongoose schema definitions
│   ├── Admin.js                    # Admin credentials schema
│   ├── ComplaintFeedback.js        # Grievance schema
│   ├── DrivingTeacher.js           # Driving instructor schema
│   ├── Expense.js                  # Vehicle expense schema
│   ├── FuelRecord.js               # Fuel and mileage schema
│   ├── Insurance.js                # Vehicle insurance policy schema
│   ├── InsurancePlan.js            # Insurance plan schema
│   ├── Loan.js                     # Vehicle loan schema
│   ├── Location.js                 # Service location schema
│   ├── Mechanic.js                 # Mechanic schema
│   ├── Notification.js             # User notification schema
│   ├── ServiceMaintenance.js       # Maintenance record schema
│   ├── TrafficSign.js              # Traffic sign schema
│   ├── User.js                     # User account schema
│   ├── Vehicle.js                  # Vehicle details schema
│   ├── VehicleDocument.js          # Vehicle document schema
│   ├── VehicleSearch.js            # Vehicle registry search schema
│   └── index.js                    # Central export for all schemas
│
├── public/                         # Static frontend files
│   ├── css/
│   │   └── styles.css              # Main project stylesheet
│   ├── js/
│   │   ├── api.js                  # Reusable fetch client and session helper
│   │   ├── navbar.js               # User navbar and logout logic
│   │   ├── admin-navbar.js         # Admin navbar
│   │   ├── dashboard.js            # User dashboard loader
│   │   ├── vehicles.js             # Vehicle listing and deletion
│   │   └── vehicle-details.js      # Vehicle detailed view
│   ├── index.html                  # Landing page
│   ├── login.html                  # User login page
│   ├── register.html               # User registration page
│   ├── dashboard.html              # Main user dashboard
│   ├── vehicles.html               # User vehicle list
│   ├── add-vehicle.html            # Add new vehicle form
│   ├── vehicle-details.html        # Vehicle profile & tabbed info
│   ├── fuel.html                   # Fuel & mileage tracker
│   ├── documents.html              # Document locker & uploader
│   ├── insurance.html              # Insurance policies & plans
│   ├── expenses.html               # Expense tracker
│   ├── services.html               # Service & maintenance logs
│   ├── nearby-places.html          # Nearby mechanics & fuel stations
│   ├── driving-teachers.html       # Driving schools & teachers
│   ├── traffic-signs.html          # Traffic & safety signs catalog
│   ├── vehicle-calculator.html     # Loan EMI and Fuel cost calculator
│   ├── vehicle-search.html         # RTO vehicle verification lookup
│   ├── notifications.html          # Alerts & reminders center
│   ├── complaints.html             # Submit grievance form
│   ├── profile.html                # User profile settings
│   └── admin-*.html                # 8 Admin Console pages
│
├── routes/                         # Express route definitions
│   ├── admin.routes.js             # /api/admin
│   ├── auth.routes.js              # /api/auth
│   ├── complaints.routes.js        # /api/complaints
│   ├── documents.routes.js         # /api/documents
│   ├── driving-teachers.routes.js  # /api/driving-teachers
│   ├── expenses.routes.js          # /api/expenses
│   ├── fuel.routes.js              # /api/fuel
│   ├── health.routes.js            # /api/health
│   ├── insurance.routes.js         # /api/insurance
│   ├── loans.routes.js             # /api/loans
│   ├── locations.routes.js         # /api/locations
│   ├── mechanics.routes.js         # /api/mechanics
│   ├── notifications.routes.js     # /api/notifications
│   ├── services.routes.js          # /api/services
│   ├── traffic-signs.routes.js     # /api/traffic-signs
│   ├── users.routes.js             # /api/users
│   ├── vehicle-search.routes.js    # /api/vehicle-search
│   └── vehicles.routes.js          # /api/vehicles
│
├── seed/
│   └── seed.js                     # Pre-populates database with demo data
│
├── uploads/                        # Uploaded document and image files
├── .env                            # Environment variables
├── .env.example                    # Sample environment variables
├── package.json                    # Project configuration and dependencies
├── server.js                       # Main application entry point
└── test-api.js                     # 15-point automated API test script
```

---

## 8. Software Requirements

Before setting up the project, make sure the following software is installed on your computer:
1. **Operating System:** Windows 10/11, macOS, or Linux.
2. **Node.js:** Version 18.x or 20.x (LTS recommended).
3. **Web Browser:** Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari.
4. **Code Editor:** Visual Studio Code (VS Code).
5. **MongoDB (Optional):** MongoDB Community Server (v6.x or v7.x). *If not installed, the project automatically starts its own embedded MongoDB server.*

---

## 9. How to Install Node.js

1. Visit the official Node.js website: [https://nodejs.org](https://nodejs.org)
2. Download the **LTS (Long Term Support)** installer for your operating system.
3. Run the downloaded installer (`.msi` on Windows) and accept the default settings.
4. Verify the installation by opening the VS Code Terminal (**Terminal $\to$ New Terminal**) or PowerShell and typing:
   ```bash
   node -v
   npm -v
   ```
   Both commands should output the installed version numbers (e.g., `v20.x.x` and `10.x.x`).

---

## 10. How to Install Project Packages

In the VS Code terminal, navigate to the project directory and run:

```bash
npm install
```

This installs all the dependencies defined in `package.json`:
* `express` – Web server framework
* `mongoose` – MongoDB object modeling
* `bcrypt` – Password hashing
* `jsonwebtoken` – JWT token generation
* `dotenv` – Loading environment variables from `.env`
* `cors` – Cross-Origin Resource Sharing
* `multer` – Handling file uploads
* `mongodb-memory-server` – Embedded MongoDB server for offline/viva use

---

## 11. How to Configure MongoDB

SafarSaathi offers two options for running MongoDB:

### Option A: Automatic Embedded Server (Recommended for Viva)
You do not need to do anything! If a local MongoDB service is not running on your machine, `config/db.js` automatically starts an embedded MongoDB database that stores persistent files inside the `.mongodb-data/` folder.

### Option B: Local MongoDB Service
If you have MongoDB Community Server installed on your machine:
1. Ensure the MongoDB service is running (Port `27017`).
2. The application will connect directly to `mongodb://127.0.0.1:27017/safarsaathi`.

---

## 12. How to Create the `.env` File

In the main project folder, ensure a file named `.env` exists with the following configuration:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/safarsaathi
JWT_SECRET=safarsaathi_mca_project_secret_key_2026
JWT_EXPIRES_IN=7d
```

---

## 13. How to Start the Project

### Step 1: Seed Demo Data (First time only)
To populate the database with sample vehicles, users, fuel records, documents, mechanics, and traffic signs for testing:

```bash
npm run seed
```

### Step 2: Start the Web Server
To launch the server:

```bash
node server.js
```
*or*
```bash
npm start
```

You will see output in the terminal confirming that the server is active:
```
SafarSaathi Web Server running on http://localhost:5000
MongoDB Connected Successfully: 127.0.0.1:27017/safarsaathi
```

### Step 3: Run Automated API Tests (Optional verification)
In a separate terminal window, you can run the test suite:

```bash
node test-api.js
```
This tests all 15 core REST endpoints and prints a confirmation:
`🎉 ALL 15 CRITICAL MEAN STACK REST APIs ARE 100% OPERATIONAL!`

---

## 14. How to Open the Website

Open your browser and navigate to the following URLs:

| Portal | URL | Demo Credentials |
| :--- | :--- | :--- |
| **Landing Page** | [http://localhost:5000/](http://localhost:5000/) | *Public Access* |
| **Citizen Sign In** | [http://localhost:5000/login](http://localhost:5000/login) | **Email:** `rahul@safarsaathi.com`<br>**Password:** `user123` |
| **Citizen Registration** | [http://localhost:5000/register](http://localhost:5000/register) | *Create a new account* |
| **User Dashboard** | [http://localhost:5000/dashboard](http://localhost:5000/dashboard) | *Requires Citizen login* |
| **Admin Login** | [http://localhost:5000/admin/login](http://localhost:5000/admin/login) | **Email:** `admin@safarsaathi.com`<br>**Password:** `admin123` |
| **Admin Dashboard** | [http://localhost:5000/admin/dashboard](http://localhost:5000/admin/dashboard) | *Requires Admin login* |

---

## 15. How Each Module Works

### Module 1: User Registration and Login
* The user enters their full name, email, phone number, and password on `register.html`.
* The frontend uses `fetch()` to send a `POST` request to `/api/auth/register`.
* The backend checks if the email already exists.
* Passwords are encrypted using `bcrypt.hash()` with 10 salt rounds.
* Upon login (`/api/auth/login`), `bcrypt.compare()` verifies the credentials.
* A signed JWT token containing the user's ID and role is returned and saved in `localStorage`.

### Module 2: User Profile Management
* Users view their registered information on `profile.html`.
* Users can update their name, phone, city, state, and address via `PUT /api/users/profile`.

### Module 3: Vehicle Management
* Allows users to register vehicles on `add-vehicle.html`.
* Information includes: Vehicle Number, Owner Name, Vehicle Type (2W/4W/Commercial), Brand, Model, Fuel Type, Chassis Number, and Engine Number.
* Vehicles are stored with a reference to the logged-in user (`userId`).
* Users can view their vehicles as cards on `vehicles.html` and open detailed vehicle specifications on `vehicle-details.html`.

### Module 4: Vehicle Document Locker
* Users upload digital copies of RC, PUC, Insurance, and Driving License.
* Users enter Issue Date and Expiry Date.
* The system calculates the remaining days and assigns a status:
  * **Valid:** More than 30 days remaining.
  * **Expiring Soon:** 30 days or fewer remaining.
  * **Expired:** Current date is past the expiry date.

### Module 5: Fuel and Mileage Tracker
* Users log every fuel fill-up with: Date, Fuel Quantity (Liters), Total Amount (₹), and Current Odometer reading (km).
* When consecutive fuel logs exist, the backend calculates mileage:
  $$\text{Mileage} = \frac{\text{Odometer (Current)} - \text{Odometer (Previous)}}{\text{Fuel Quantity (Liters)}}$$
* Fuel expense totals and average mileage are summarized dynamically.

### Module 6: Service and Maintenance
* Users record workshop visits: Service Type (General Service, Oil Change, Brake Overhaul), Workshop Name, Cost, and Date.
* Users set the "Next Service Due Date" or "Next Service km" to trigger upcoming maintenance reminders.

### Module 7: Expense Tracker
* Tracks all monetary expenses associated with vehicles: Fuel, Servicing, Insurance, Tolls, Parking, and Accessories.
* Displays a category-wise breakdown and monthly spending totals.

### Module 8: Insurance & Loan Calculator
* **Insurance:** Browse insurance plans (Comprehensive, Third-Party, Zero Depreciation) and track policy numbers, providers, and premium amounts.
* **Loan EMI Calculator:** Uses the standard financial formula:
  $$E = \frac{P \times r \times (1 + r)^n}{(1 + r)^n - 1}$$
  where $P$ is principal, $r$ is monthly interest rate, and $n$ is tenure in months.

### Module 9: Location-Based Services
* Provides an interactive directory of verified service centers:
  * Emergency roadside mechanics with direct call buttons.
  * 24/7 Petrol pumps and CNG filling stations.
  * Government-authorized PUC testing centers.
  * Electric Vehicle (EV) fast-charging points.

### Module 10: Traffic Signs and Road Safety
* Categorized catalog of traffic signs:
  * **Mandatory / Regulatory Signs:** Red circular signs (e.g., Stop, Speed Limit).
  * **Cautionary / Warning Signs:** Triangular signs (e.g., Narrow Bridge, School Ahead).
  * **Informatory Signs:** Rectangular signs (e.g., Hospital, Parking, First Aid Post).

### Module 11: Notifications & Reminders
* The system automatically scans document expiry dates and upcoming service due dates.
* When an item has 30 days or less remaining, an alert notification is generated and shown on the dashboard and notifications page.

### Module 12: Dashboard & Analytics
* Displays quick summary cards: Total Vehicles, Active Policies, Monthly Spending, and Unread Alerts.
* Lists all user vehicles with quick links to View Details, Add Fuel, or Upload Documents.

### Module 13: Administrator Console
* **Admin Dashboard:** System-wide counts of registered users, vehicles, total loans, and pending complaints.
* **User Management:** View all users, search by name/email, and toggle status.
* **Directory Management:** Add new mechanics and driving schools to the public directory.
* **Complaint Review:** Read user complaints and update resolution status.

---

## 16. Database Collections

The database uses 17 collections defined through Mongoose schemas in `models/`:

1. `users` – Full name, email, phone, password hash, address, account type (Individual/Business), status.
2. `admins` – Admin email, hashed password, role (Super Admin, Moderator).
3. `vehicles` – User ID reference, vehicle number, brand, model, type, fuel type, chassis number, engine number.
4. `vehicledocuments` – Vehicle ID, document type (RC, PUC, Insurance), file path, issue date, expiry date.
5. `fuelrecords` – Vehicle ID, fuel quantity, total cost, odometer reading, calculated mileage.
6. `servicemaintenances` – Vehicle ID, service type, workshop name, cost, next service due.
7. `expenses` – Vehicle ID, expense category, amount, description, date.
8. `insurances` – Vehicle ID, policy number, provider, premium amount, expiry date.
9. `insuranceplans` – Plan title, provider, premium price, coverage details.
10. `loans` – Vehicle ID, bank name, loan amount, interest rate, tenure, monthly EMI.
11. `mechanics` – Workshop name, mechanic name, phone, address, services offered, rating.
12. `drivingteachers` – Instructor name, school name, phone, experience, hourly rate.
13. `locations` – Facility name, category (Petrol Pump, PUC Center, EV Station), address, contact.
14. `trafficsigns` – Sign name, sign category (Mandatory, Cautionary, Informatory), image, description.
15. `notifications` – User ID, title, message, alert type, read status.
16. `complaintfeedbacks` – User ID, title, category, message, status (Pending, Resolved).
17. `vehiclesearches` – Public registry data for RTO vehicle lookup simulation.

---

## 17. API Explanation

All API routes follow standard RESTful conventions:

### Authentication (`/api/auth`)
* `POST /api/auth/register` – Register a new user account.
* `POST /api/auth/login` – User sign in, returns JWT token.
* `POST /api/auth/admin-login` – Admin console sign in.

### Vehicles (`/api/vehicles`)
* `GET /api/vehicles` – Get all vehicles owned by logged-in user.
* `POST /api/vehicles` – Add a new vehicle.
* `GET /api/vehicles/:id` – Get single vehicle details.
* `PUT /api/vehicles/:id` – Update vehicle details.
* `DELETE /api/vehicles/:id` – Delete a vehicle.

### Documents (`/api/documents`)
* `GET /api/documents` – List all uploaded documents.
* `POST /api/documents` – Upload a new vehicle document (with file).
* `DELETE /api/documents/:id` – Delete a document.

### Fuel & Mileage (`/api/fuel`)
* `GET /api/fuel` – Get fuel logs and mileage statistics.
* `POST /api/fuel` – Add a fuel entry and calculate mileage.
* `DELETE /api/fuel/:id` – Remove a fuel entry.

### Expenses (`/api/expenses`)
* `GET /api/expenses` – Get all expenses and total sum.
* `POST /api/expenses` – Record a new expense.
* `DELETE /api/expenses/:id` – Delete an expense.

### Services (`/api/services`)
* `GET /api/services` – List all maintenance records.
* `POST /api/services` – Add a maintenance log.

### Admin (`/api/admin`)
* `GET /api/admin/dashboard` – Overall system counts and statistics.
* `GET /api/admin/users` – List all users.
* `PUT /api/admin/users/:id/status` – Block or activate a user account.
* `GET /api/admin/reports` – System financial and fleet reports.

---

## 18. Important Code Files and Their Purpose

| File | Purpose |
| :--- | :--- |
| `server.js` | Express app initialization, static file serving, route registration, and server port listening. |
| `config/db.js` | Connects Mongoose to MongoDB with embedded memory fallback. |
| `middleware/auth.middleware.js` | Checks `Authorization: Bearer <token>` header on protected routes. |
| `public/js/api.js` | Contains helper functions `apiGet()`, `apiPost()`, `apiPut()`, `apiDelete()`, and `getToken()`. |
| `controllers/auth.controller.js` | Handles user registration, bcrypt password hashing, and JWT token issuance. |
| `controllers/vehicles.controller.js` | Implements vehicle CRUD operations linked to `req.user.id`. |
| `controllers/fuel.controller.js` | Calculates mileage between consecutive odometer readings. |
| `test-api.js` | Automated script that tests all backend routes. |

---

## 19. Common Errors and Their Solutions

### 1. `Error: listen EADDRINUSE: address already in use :::5000`
* **Cause:** Another process or previous node instance is already running on port 5000.
* **Solution:** Close other terminal windows, or run this PowerShell command to stop it:
  ```powershell
  Stop-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess -Force
  ```
  Then restart with `node server.js`.

### 2. `Access denied. No token provided.` (Status 401)
* **Cause:** The user is attempting to access a protected API route without logging in.
* **Solution:** Log in at `/login` so the JWT token is saved to `localStorage`.

### 3. `Local MongoDB service not detected on port 27017`
* **Status:** This is **not** an error! The system will automatically log:
  `Starting embedded MongoDB server... MongoDB Connected Successfully (Embedded Local Server)`.
  The application works smoothly without requiring any manual action.

---

## 20. Future Enhancements

For future versions of SafarSaathi:
1. **SMS / WhatsApp Alerts:** Integration with Twilio or MSG91 to send direct WhatsApp notifications for document expiry.
2. **GPS Real-Time Tracking:** Integration with vehicle OBD-II GPS hardware for live location tracking.
3. **Automated RC OCR Scanning:** Use optical character recognition (OCR) to automatically extract vehicle details from uploaded RC photos.
4. **Online Service Booking:** Allow users to schedule maintenance appointments directly with registered mechanics.
5. **Mobile Application:** Build a hybrid mobile application using Flutter or React Native.

---

*Developed by Diya for MCA Semester 3 Project Evaluation (2026).*
