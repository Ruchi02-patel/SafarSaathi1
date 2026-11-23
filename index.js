// SafarSaathi Mongoose Models Index
// All 16 collections specified in the SRS

const User = require('./User');
const Vehicle = require('./Vehicle');
const VehicleDocument = require('./VehicleDocument');
const Insurance = require('./Insurance');
const InsurancePlan = require('./InsurancePlan');
const Loan = require('./Loan');
const Mechanic = require('./Mechanic');
const DrivingTeacher = require('./DrivingTeacher');
const Location = require('./Location');
const TrafficSign = require('./TrafficSign');
const Expense = require('./Expense');
const ServiceMaintenance = require('./ServiceMaintenance');
const Notification = require('./Notification');
const ComplaintFeedback = require('./ComplaintFeedback');
const Admin = require('./Admin');
const VehicleSearch = require('./VehicleSearch');
const FuelRecord = require('./FuelRecord');

module.exports = {
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
};
