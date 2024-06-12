import dotenv from "dotenv";
import { userSchema } from "../models/User.js";
import cloudinary from "cloudinary";
dotenv.config();

const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = process.env;

const saveAvatar = async (tmpUpload, _id) => {
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });
  const result = await cloudinary.uploader.upload(tmpUpload);
  const url = cloudinary.url(result.public_id, {
    width: 100,
    height: 150,
    crop: "fill",
  });
  return url;
};

const updateUserData = async (userId, updatedData) => {
  if (updatedData.password) {
    updatedData.password = await bcryptjs.hash(updatedData.password, 10);
  }

  const updatedUser = await userSchema.findByIdAndUpdate(userId, updatedData, {
    new: true,
  });

  updatedUser.password = undefined;
  return updatedUser || null;
};

const updateThemeDB = async (idOwner, theme) => {
  const updateTheme = await userSchema.findOneAndUpdate(
    idOwner,
    { theme },
    { new: true }
  );
  return updateTheme;
};
export default {
  saveAvatar,
  updateUserData,
  updateThemeDB,
};
