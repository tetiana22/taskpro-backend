import dotenv from "dotenv";
import { User } from "../models/User.js";
import cloudinary from "cloudinary";
import bcryptjs from "bcryptjs";
dotenv.config();

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
  process.env;

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const saveAvatar = async (tmpUpload, _id) => {
  try {
    const result = await cloudinary.uploader.upload(tmpUpload, {
      upload_preset: "ru6zopod", // Замініть на вашу налаштування
    });
    console.log("Upload result:", result);
    return result.secure_url; // Повертаємо URL зображення з Cloudinary
  } catch (error) {
    console.error("Error uploading avatar:", error);
    throw new Error("Error uploading avatar");
  }
};

export default saveAvatar;
