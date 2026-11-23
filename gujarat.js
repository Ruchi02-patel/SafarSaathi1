// Gujarat Regional Configuration & Canonical City List
// SafarSaathi - Vehicle Management System

const GUJARAT_CITIES = [
  'Ahmedabad',
  'Surat',
  'Vadodara',
  'Rajkot',
  'Gandhinagar',
  'Anand',
  'Nadiad',
  'Bharuch',
  'Ankleshwar',
  'Valsad',
  'Navsari',
  'Junagadh',
  'Jamnagar',
  'Bhavnagar',
  'Morbi',
  'Mehsana',
  'Palanpur',
  'Porbandar',
  'Godhra',
  'Dahod',
  'Surendranagar',
  'Amreli',
  'Botad',
  'Patan',
  'Himmatnagar'
];

const isValidGujaratCity = (city) => {
  if (!city || typeof city !== 'string') return false;
  return GUJARAT_CITIES.some(c => c.toLowerCase() === city.trim().toLowerCase());
};

const normalizeGujaratCity = (city) => {
  if (!city || typeof city !== 'string') return null;
  const match = GUJARAT_CITIES.find(c => c.toLowerCase() === city.trim().toLowerCase());
  return match || city.trim();
};

const GUJARAT_DEFAULTS = {
  state: 'Gujarat',
  country: 'India',
  currency: '₹',
  dateFormat: 'DD-MM-YYYY'
};

module.exports = {
  GUJARAT_CITIES,
  isValidGujaratCity,
  normalizeGujaratCity,
  GUJARAT_DEFAULTS
};
