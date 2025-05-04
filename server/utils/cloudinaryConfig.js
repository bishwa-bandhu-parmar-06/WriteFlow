const cloudinary = require("cloudinary").v2;

// ✅ Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Upload Function
module.exports.uploadToCloudinary = async (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: folder },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          return reject(new Error("Failed to upload image"));
        }
        resolve(result.secure_url); // Return Cloudinary URL
      }
    );
    uploadStream.end(fileBuffer);
  });
};
