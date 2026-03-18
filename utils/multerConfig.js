const multer = require('multer');

// --- 1. YOUR EXISTING STORAGE ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
  
    if (file.fieldname === 'home-rules') {
      cb(null, 'uploads/rules'); // Store rules in a separate folder
    } else if (file.fieldname === 'photo') {
      cb(null, 'uploads/images'); // Store photos in a separate folder
    } else {
      cb(new Error('Unknown file field'), false);
    }
  },
  filename: (req, file, cb) => {
    // Use a unique name (you can use your random string)
    cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
  }
});

// --- 2. THE "SMART" COMBINED FILE FILTER ---
const fileFilter = (req, file, cb) => {
  // Check if it's the 'photo' field
  if (file.fieldname === 'photo') {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/avif'
    ) {
      cb(null, true); // Accept images
    } else {
      cb(new Error('Only image files (png, jpg, jpeg, avif) are allowed for photos!'), false);
    }
  }
  // Check if it's the 'home-rules' field
  else if (file.fieldname === 'home-rules') {
    if (file.mimetype === 'application/pdf') {
      cb(null, true); // Accept PDFs
    } else {
      cb(new Error('Only .pdf files are allowed for rules!'), false);
    }
  }
  // Unknown field
  else {
    cb(new Error('An unexpected file field was received.'), false);
  }
};

// --- 3. CREATE AND EXPORT THE 'upload' INSTANCE ---
const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

module.exports = upload;
