import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "cloudinary";
import dotenv from "dotenv";
import { User } from "../models/User.js";
import authServices from "../services/authServices.js"; // Update path as per your project structure

dotenv.config();

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
  process.env;

cloudinary.v2.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: async (req, file) => {
    let folder = "avatars"; // Default folder for avatars
    if (file.fieldname === "documents") {
      folder = "documents"; // Adjust based on your requirements
    } else if (file.fieldname === "misc") {
      folder = "misc"; // Adjust based on your requirements
    }
    return {
      folder,
      allowed_formats: ["jpg", "png", "webp", "jpeg"], // Adjust allowed formats as needed
      public_id: req.user._id, // Use original filename as the public ID
      transformation: [
        { width: 350, height: 350, crop: "fill" },
        { width: 700, height: 700, crop: "fill" },
      ],
    };
  },
});

const upload = multer({ storage });

export default upload;
