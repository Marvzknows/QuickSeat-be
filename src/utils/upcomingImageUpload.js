import cloudinary from "./cloudinary.js";

const imageUploadToCloud = async (file, folderName) => {
  return new Promise((resolve, reject) => {
    try {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: folderName },
        (error, result) => {
          if (error) {
            return reject("Image upload failed.");
          }

          // If upload is successful, return the image URL
          const imageUrl = result?.secure_url || null; // return null if no URL
          resolve(imageUrl);
        }
      );

      // Write the file buffer to the Cloudinary upload stream
      // Writes the binary content of the uploaded file to the Cloudinary stream.
      // Triggers the upload process in Cloudinary, which uses the data to process and store the file.
      uploadStream.end(file.buffer);
    } catch (error) {
      reject(`Image upload failed: ${error.message}`);
    }
  });
};

export default imageUploadToCloud;
