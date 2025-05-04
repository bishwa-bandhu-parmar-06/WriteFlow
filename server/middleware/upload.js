const multer = require('multer');

// Store in memory so we can send buffer to Cloudinary
const storage = multer.memoryStorage();

const upload = multer({ storage });

module.exports = upload;
