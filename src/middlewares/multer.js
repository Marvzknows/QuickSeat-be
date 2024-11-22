import multer from 'multer';

// Configure Multer to use memory storage
const storage = multer.memoryStorage(); // Keeps the file in memory
const upload = multer({ storage }); // Create the Multer upload middleware

export default upload;
